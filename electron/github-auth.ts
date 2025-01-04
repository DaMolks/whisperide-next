import { BrowserWindow, ipcMain } from 'electron';
import express from 'express';
import { AddressInfo } from 'net';
import * as portfinder from 'portfinder';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'your_client_id';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'your_client_secret';

export function setupGithubAuth() {
  ipcMain.handle('github-auth-login', async () => {
    return new Promise(async (resolve, reject) => {
      try {
        // Trouver un port disponible
        const port = await portfinder.getPortPromise({
          port: 3000,    // Port de départ
          stopPort: 4000  // Port maximum
        });

        // Créer un serveur express temporaire
        const server = express();
        const listener = server.listen(port, () => {
          console.log(`OAuth callback server listening on port ${port}`);

          const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true
            }
          });

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
                    code,
                    redirect_uri: `http://localhost:${port}/oauth/callback`
                  })
                });

                const data = await response.json();
                console.log('OAuth response:', data);

                // Fermer le serveur express
                listener.close();

                if (data.error) {
                  console.error('OAuth error:', data.error);
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
                console.error('Token exchange error:', error);
                // Fermer le serveur express en cas d'erreur
                listener.close();
                reject(error);
                res.send('<script>window.close()</script>');
              }
            } else {
              res.status(400).send('No code provided');
            }
          });

          // Gérer la fermeture de la fenêtre
          win.on('closed', () => {
            listener.close();
            reject(new Error('Window was closed'));
          });

          // L'URL d'authentification GitHub avec le port dynamique
          const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo&redirect_uri=${encodeURIComponent(`http://localhost:${port}/oauth/callback`)}`;
          console.log('Opening auth URL:', authUrl);
          win.loadURL(authUrl);
        });

        // Gérer les erreurs du serveur
        listener.on('error', (error: Error & { code?: string }) => {
          console.error('Server error:', error);
          reject(error);
        });
      } catch (error) {
        console.error('Setup error:', error);
        reject(error);
      }
    });
  });
}