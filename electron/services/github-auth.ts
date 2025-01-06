import { BrowserWindow, app } from 'electron';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface AuthConfig {
  clientId: string;
  clientSecret: string;
  scopes: string[];
}

interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export class GitHubAuthService {
  private static readonly CONFIG_DIR = path.join(app.getPath('userData'), 'auth');
  private static readonly TOKEN_PATH = path.join(GitHubAuthService.CONFIG_DIR, 'github.enc');
  private static readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-replace-in-prod';

  static async authorize(): Promise<string> {
    // D'abord, essayer de récupérer un token existant
    const existingToken = await this.getStoredToken();
    if (existingToken && !this.isTokenExpired(existingToken)) {
      return existingToken.accessToken;
    }

    // Si pas de token ou expiré, en demander un nouveau
    return this.requestNewToken();
  }

  private static async requestNewToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const config = this.getConfig();
      const authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });

      // Générer un state aléatoire pour la sécurité
      const state = crypto.randomBytes(16).toString('hex');

      const authUrl = this.getAuthUrl(config, state);
      authWindow.loadURL(authUrl);
      authWindow.show();

      authWindow.webContents.on('will-redirect', async (event, url) => {
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

            // Échanger le code contre un token
            const tokenInfo = await this.exchangeCodeForToken(code, config);
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

  private static getConfig(): AuthConfig {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('GitHub OAuth credentials are not configured');
    }

    return {
      clientId,
      clientSecret,
      scopes: ['repo', 'user']
    };
  }

  private static getAuthUrl(config: AuthConfig, state: string): string {
    const params = new URLSearchParams({
      client_id: config.clientId,
      scope: config.scopes.join(' '),
      state: state,
      redirect_uri: 'whisperide://oauth/callback'
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  private static async exchangeCodeForToken(code: string, config: AuthConfig): Promise<TokenInfo> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
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
    try {
      await fs.mkdir(this.CONFIG_DIR, { recursive: true });

      const cipher = crypto.createCipher('aes-256-cbc', this.ENCRYPTION_KEY);
      let encrypted = cipher.update(JSON.stringify(tokenInfo), 'utf8', 'hex');
      encrypted += cipher.final('hex');

      await fs.writeFile(this.TOKEN_PATH, encrypted);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
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
    // Considérer le token comme expiré 5 minutes avant son expiration réelle
    return Date.now() > (tokenInfo.expiresAt - 300000);
  }
}