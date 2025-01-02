import { app, BrowserWindow } from 'electron';
import * as path from 'path';

class WhisperIDEApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    app.on('ready', this.createWindow);
    app.on('window-all-closed', this.handleWindowsClosed);
  }

  private createWindow = () => {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this.mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }

  private handleWindowsClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

new WhisperIDEApp();