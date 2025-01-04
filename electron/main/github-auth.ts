import { BrowserWindow, ipcMain } from 'electron';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'your_client_id';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'your_client_secret';

export function setupGithubAuth() {
  ipcMain.handle('github-auth-login', async () => {
    return new Promise((resolve, reject) => {
      console.log('Starting GitHub auth process...');
      console.log('Using client ID:', GITHUB_CLIENT_ID);
      
      const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });

      // URL de base simple pour l'authentification GitHub
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo`;
      console.log('Auth URL:', authUrl);

      // Capturer toutes les navigations possibles
      win.webContents.on('will-navigate', (event, url) => {
        console.log('will-navigate:', url);
      });

      win.webContents.on('did-navigate', (event, url) => {
        console.log('did-navigate:', url);
      });

      win.webContents.on('will-redirect', (event, url) => {
        console.log('will-redirect:', url);
      });

      win.webContents.on('did-redirect-navigation', (event, url) => {
        console.log('did-redirect-navigation:', url);
      });

      // Capturer le code lorsqu'il apparaît dans l'URL
      const handleCode = async (url: string) => {
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get('code');

        if (code) {
          console.log('Got code from GitHub!');
          try {
            console.log('Exchanging code for token...');
            const response = await fetch('https://github.com/login/oauth/access_token', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code
              })
            });

            const data = await response.json();
            console.log('Token response:', data);
            
            if (data.error) {
              console.error('GitHub auth error:', data);
              reject(new Error(data.error_description || data.error));
            } else if (data.access_token) {
              resolve(data.access_token);
            } else {
              reject(new Error('No access token received'));
            }
            win.close();
          } catch (error) {
            console.error('Error in token exchange:', error);
            reject(error);
            win.close();
          }
        }
      };

      // Écouter toutes les navigations pour le code
      win.webContents.on('will-navigate', (_, url) => handleCode(url));
      win.webContents.on('will-redirect', (_, url) => handleCode(url));
      win.webContents.on('did-redirect-navigation', (_, url) => handleCode(url));

      win.on('closed', () => {
        reject(new Error('Window was closed'));
      });

      console.log('Loading GitHub auth page...');
      win.loadURL(authUrl);
    });
  });
}