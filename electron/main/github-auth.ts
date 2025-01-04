import { BrowserWindow, ipcMain } from 'electron';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'your_client_id';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'your_client_secret';
const REDIRECT_URI = 'http://localhost:8080/oauth/callback';

export function setupGithubAuth() {
  ipcMain.handle('github-auth-login', async () => {
    // Créer une nouvelle fenêtre pour l'auth GitHub
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    // URL d'authentification GitHub avec redirection explicite
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo`;

    return new Promise((resolve, reject) => {
      win.webContents.on('will-redirect', async (event, url) => {
        if (url.startsWith(REDIRECT_URI)) {
          event.preventDefault();
          const urlObj = new URL(url);
          const code = urlObj.searchParams.get('code');

          if (code) {
            try {
              const response = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  client_id: GITHUB_CLIENT_ID,
                  client_secret: GITHUB_CLIENT_SECRET,
                  code,
                  redirect_uri: REDIRECT_URI
                })
              });

              const data = await response.json();
              
              if (data.error) {
                console.error('GitHub auth error:', data.error_description || data.error);
                reject(new Error(data.error_description || data.error));
                win.close();
                return;
              }
              
              if (data.access_token) {
                resolve(data.access_token);
                win.close();
              } else {
                reject(new Error('No access token received'));
                win.close();
              }
            } catch (error) {
              console.error('Error exchanging code:', error);
              reject(error);
              win.close();
            }
          }
        }
      });

      win.webContents.on('will-navigate', (event, url) => {
        // Log navigation for debugging
        console.log('Navigating to:', url);
      });

      win.on('closed', () => {
        reject(new Error('Window was closed'));
      });

      // Load the auth URL
      console.log('Loading auth URL:', authUrl);
      win.loadURL(authUrl);
    });
  });
}