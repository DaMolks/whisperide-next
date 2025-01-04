import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { config } from 'dotenv';
import { setupProjectHandlers } from './project';
import { setupGithubAuth } from './github-auth';

// Charger les variables d'environnement
config();

// Vérifier les variables d'environnement requises
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.error('Missing GitHub OAuth credentials in .env file');
  process.exit(1);
}

// Enregistrer le protocole personnalisé
if (process.defaultApp) {
  app.setAsDefaultProtocolClient('whisperide', process.execPath, [path.resolve(process.argv[1])]);
} else {
  app.setAsDefaultProtocolClient('whisperide');
}

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('index.html');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  setupProjectHandlers();
  setupGithubAuth();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Gestion des arguments en ligne de commande pour le protocole personnalisé
app.on('second-instance', (event, commandLine) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();

    // Gérer l'URL de redirection
    const url = commandLine.find(arg => arg.startsWith('whisperide://'));
    if (url) {
      app.emit('open-url', event, url);
    }
  }
});

// Contrôles de fenêtre
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on('window-close', () => mainWindow?.close());