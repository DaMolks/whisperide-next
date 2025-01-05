const { app, BrowserWindow } = require('electron');
import * as path from 'path';

type Process = NodeJS.Process & {
  defaultApp?: boolean;
};

declare const process: Process;

let mainWindow: typeof BrowserWindow | null = null;

app.whenReady().then(async () => {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
  }

  // Différence entre développement et production
  if (process.defaultApp) {
    // Mode développement
    app.setAsDefaultProtocolClient('whisperide');
  } else {
    // Mode production
    app.setAsDefaultProtocolClient('whisperide', process.execPath);
  }

  createWindow();
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

app.on('second-instance', (_: Electron.Event, commandLine: string[]) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();

    const url = commandLine.find((arg: string) => arg.startsWith('whisperide://'));
    if (url) {
      mainWindow.webContents.send('url-open', url);
    }
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}