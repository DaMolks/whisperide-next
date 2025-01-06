import { BrowserWindow, app } from 'electron';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

let config: { github: { clientId: string; clientSecret: string } };

try {
  if (process.env.NODE_ENV === 'development') {
    config = {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
      }
    };
  } else {
    const configPath = process.env.ELECTRON_IS_DEV 
      ? path.join(__dirname, '../config.js')
      : path.join(app.getPath('userData'), 'config.js');
    config = require(configPath);
  }
} catch (error) {
  console.error('Failed to load GitHub configuration:', error);
  config = { github: { clientId: '', clientSecret: '' } };
}

export class GitHubAuthService {
  private static readonly CONFIG_DIR = path.join(app.getPath('userData'), 'auth');
  private static readonly TOKEN_PATH = path.join(GitHubAuthService.CONFIG_DIR, 'github.enc');
  private static readonly ENCRYPTION_KEY = crypto.randomBytes(32);

  static async authorize(): Promise<string> {
    if (!config.github.clientId || !config.github.clientSecret) {
      throw new Error('GitHub OAuth credentials are not configured');
    }

    const existingToken = await this.getStoredToken();
    if (existingToken && !this.isTokenExpired(existingToken)) {
      return existingToken.accessToken;
    }

    return this.requestNewToken();
  }

  private static async requestNewToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const state = crypto.randomBytes(16).toString('hex');
      const authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });

      const authUrl = this.getAuthUrl(state);
      authWindow.loadURL(authUrl);
      authWindow.show();

      authWindow.webContents.on('will-redirect', async (event: Electron.Event, url: string) => {
        try {
          const urlObj = new URL(url);
          if (urlObj.protocol === 'whisperide:') {
            const returnedState = urlObj.searchParams.get('state');
            const code = urlObj.searchParams.get('code');

            if (returnedState !== state) {
              throw new Error('State mismatch');
            }

            if (!code) {
              throw new Error('No code received');
            }

            const tokenInfo = await this.exchangeCodeForToken(code);
            await this.storeToken(tokenInfo);

            resolve(tokenInfo.accessToken);
            authWindow.close();
          }
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Failed to process auth callback'));
          authWindow.close();
        }
      });

      authWindow.on('closed', () => {
        reject(new Error('Authentication window was closed'));
      });
    });
  }

  private static getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: config.github.clientId,
      scope: 'repo user',
      state: state,
      redirect_uri: 'whisperide://oauth/callback'
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  private static async exchangeCodeForToken(code: string): Promise<TokenInfo> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code: code
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_in ? Date.now() + (data.expires_in * 1000) : undefined
    };
  }

  private static async storeToken(tokenInfo: TokenInfo): Promise<void> {
    await fs.mkdir(this.CONFIG_DIR, { recursive: true });

    const cipher = crypto.createCipher('aes-256-cbc', this.ENCRYPTION_KEY);
    let encrypted = cipher.update(JSON.stringify(tokenInfo), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    await fs.writeFile(this.TOKEN_PATH, encrypted);
  }

  private static async getStoredToken(): Promise<TokenInfo | null> {
    try {
      const encrypted = await fs.readFile(this.TOKEN_PATH, 'utf8');
      const decipher = crypto.createDecipher('aes-256-cbc', this.ENCRYPTION_KEY);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  private static isTokenExpired(tokenInfo: TokenInfo): boolean {
    if (!tokenInfo.expiresAt) return false;
    return Date.now() > (tokenInfo.expiresAt - 300000);
  }
}

interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}