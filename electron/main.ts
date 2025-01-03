import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

class WhisperIDEApp {
  private mainWindow: BrowserWindow | null = null;
  private splashWindow: BrowserWindow | null = null;

  constructor() {
    app.on('ready', this.createSplash);
    app.on('window-all-closed', this.handleWindowsClosed);
    this.setupIPC();
  }

  private createSplash = async () => {
    this.splashWindow = new BrowserWindow({
      width: 600,
      height: 400,
      frame: false,
      transparent: true,
      resizable: false,
      center: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    if (process.env.NODE_ENV === 'development') {
      await this.splashWindow.loadURL('http://localhost:8080/splash.html');
    } else {
      await this.splashWindow.loadFile(path.join(__dirname, '../splash.html'));
    }

    setTimeout(() => {
      this.createMainWindow();
    }, 3000);
  }

  private createMainWindow = async () => {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      show: false,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    if (process.env.NODE_ENV === 'development') {
      await this.mainWindow.loadURL('http://localhost:8080');
    } else {
      await this.mainWindow.loadFile(path.join(__dirname, '../index.html'));
    }

    this.mainWindow.show();
    if (this.splashWindow) {
      this.splashWindow.close();
      this.splashWindow = null;
    }
  }

  // ... reste du code ...
}

new WhisperIDEApp();