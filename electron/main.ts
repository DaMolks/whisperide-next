import { app, BrowserWindow } from 'electron';
import * as path from 'path';

class WhisperIDEApp {
  private mainWindow: BrowserWindow | null = null;
  private splashWindow: BrowserWindow | null = null;

  constructor() {
    app.on('ready', this.createSplash);
    app.on('window-all-closed', this.handleWindowsClosed);
  }

  private createSplash = async () => {
    this.splashWindow = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      transparent: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    if (process.env.NODE_ENV === 'development') {
      await this.splashWindow.loadURL('http://localhost:8080/splash.html');
    } else {
      await this.splashWindow.loadFile(path.join(__dirname, '../splash.html'));
    }

    // Simule le chargement
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
        contextIsolation: false
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

  private handleWindowsClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

new WhisperIDEApp();