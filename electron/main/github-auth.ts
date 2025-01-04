import { BrowserWindow, ipcMain } from 'electron';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

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

    // URL de base pour l'authentification GitHub
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo`;

    // Charger l'URL d'authentification GitHub
    win.loadURL(authUrl);

    return new Promise((resolve, reject) => {
      // Gérer la redirection après l'authentification
      win.webContents.on('will-redirect', async (event, url) => {
        const match = url.match(/[?&]code=([^&]*)/); // Extraire le code
        if (match) {
          const code = match[1];
          try {
            // Échanger le code contre un token
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
            win.close();
            
            if (data.access_token) {
              resolve(data.access_token);
            } else {
              reject(new Error('No access token received'));
            }
          } catch (error) {
            win.close();
            reject(error);
          }
        }
      });

      // Gérer la fermeture de la fenêtre
      win.on('closed', () => {
        reject(new Error('Window was closed'));
      });
    });
  });
}