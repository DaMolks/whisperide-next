import { BrowserWindow } from 'electron';

export interface GitHubAuthConfig {
  clientId: string;
  scopes: string[];
}

export class GitHubAuthService {
  private static readonly CLIENT_ID = 'Ov23liVipHbxEjnSpNXe';
  private static readonly SCOPES = ['repo', 'user'];
  private static readonly REDIRECT_URI = 'whisperide://oauth/callback';

  public static getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      scope: this.SCOPES.join(' '),
      response_type: 'token'
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  public static async authorize(): Promise<string> {
    return new Promise((resolve, reject) => {
      const authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          nodeIntegration: false
        }
      });

      authWindow.loadURL(this.getAuthUrl());
      authWindow.show();

      authWindow.webContents.on('will-redirect', (event, url) => {
        const urlObj = new URL(url);
        if (urlObj.protocol === 'whisperide:') {
          const token = urlObj.searchParams.get('access_token');
          if (token) {
            resolve(token);
            authWindow.close();
          }
        }
      });

      authWindow.on('closed', () => {
        reject(new Error('Authentication window was closed'));
      });
    });
  }
}