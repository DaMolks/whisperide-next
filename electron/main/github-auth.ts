import { BrowserWindow, ipcMain } from 'electron';
import express from 'express';
import { AddressInfo } from 'net';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'your_client_id';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'your_client_secret';

export function setupGithubAuth() {
  // Créer un serveur express temporaire pour gérer la redirection OAuth
  let server: ReturnType<typeof express> | null = null;

  ipcMain.handle('github-auth-login', async () => {
    return new Promise((resolve, reject) => {
      // Créer un serveur express temporaire
      server = express();
      const listener = server.listen(8080);
      const port = (listener.address() as AddressInfo).port;

      // Route pour gérer le callback OAuth
      server.get('/oauth/callback', async (req, res) => {
        const { code } = req.query;

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
                code
              })
            });

            const data = await response.json();

            // Fermer le serveur express
            listener.close();
            server = null;

            if (data.error) {
              reject(new Error(data.error_description || data.error));
              res.send('<script>window.close()</script>');
            } else if (data.access_token) {
              resolve(data.access_token);
              res.send('<script>window.close()</script>');
            } else {
              reject(new Error('No access token received'));
              res.send('<script>window.close()</script>');
            }
          } catch (error) {
            // Fermer le serveur express en cas d'erreur
            listener.close();
            server = null;
            reject(error);
            res.send('<script>window.close()</script>');
          }
        } else {
          res.status(400).send('No code provided');
        }
      });

      const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo`;

      win.on('closed', () => {
        // Nettoyage du serveur si la fenêtre est fermée
        if (server) {
          listener.close();
          server = null;
        }
        reject(new Error('Window was closed'));
      });

      win.loadURL(authUrl);
    });
  });
}