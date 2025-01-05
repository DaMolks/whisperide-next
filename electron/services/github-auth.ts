const { BrowserWindow } = require('electron');
import type { Event } from 'electron';

export class GitHubAuthService {
  static async authorize(): Promise<string> {
    return new Promise((resolve, reject) => {
      const authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });

      const authUrl = this.getAuthUrl();
      authWindow.loadURL(authUrl);
      authWindow.show();

      authWindow.webContents.on('will-redirect', (event: Event, redirectUrl: string) => {
        try {
          const urlObj = new URL(redirectUrl);
          if (urlObj.protocol === 'whisperide:') {
            const token = urlObj.searchParams.get('access_token');
            if (token) {
              resolve(token);
              authWindow.close();
            } else {
              reject(new Error('No access token received'));
              authWindow.close();
            }
          }
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Failed to process redirect URL'));
          authWindow.close();
        }
      });

      authWindow.on('closed', () => {
        reject(new Error('Authentication window was closed'));
      });
    });
  }

  private static getAuthUrl(): string {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      throw new Error('GitHub client ID is not configured');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      scope: 'repo user',
      response_type: 'token'
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }
}