import { app, BrowserWindow } from 'electron';
import * as path from 'path';

class WhisperIDEApp {
  private mainWindow: BrowserWindow | null = null;
  private splashWindow: BrowserWindow | null = null;

  constructor() {
    app.on('ready', this.createSplashWindow);
    app.on('window-all-closed', this.handleWindowsClosed);
  }

  private createSplashWindow = () => {
    this.splashWindow = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      transparent: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true
      }
    });

    this.splashWindow.loadFile('splash.html');
    this.initializeApp();
  }

  private initializeApp = async () => {
    // TODO: Vérification des dépendances
    await this.createMainWindow();
    if (this.splashWindow) {
      this.splashWindow.close();
    }
  }

  private createMainWindow = async () => {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      frame: false,
      show: false,
      webPreferences: {
        nodeIntegration: true
      }
    });

    await this.mainWindow.loadFile('index.html');
    this.mainWindow.show();
  }

  private handleWindowsClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

new WhisperIDEApp();