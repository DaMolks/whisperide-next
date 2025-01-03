import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

class WhisperIDEApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    app.on('ready', this.createMainWindow);
    app.on('window-all-closed', this.handleWindowsClosed);
    this.setupIPC();
  }

  private createMainWindow = async () => {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      frame: false,
      show: false,
      backgroundColor: '#1a1a1a',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    this.mainWindow.center();

    if (process.env.NODE_ENV === 'development') {
      await this.mainWindow.loadURL('http://localhost:8080');
      this.mainWindow.show();
    } else {
      await this.mainWindow.loadFile(path.join(__dirname, '../index.html'));
      this.mainWindow.show();
    }
  }

  private setupIPC() {
    ipcMain.on('window-control', (_, command: string) => {
      switch (command) {
        case 'minimize':
          this.mainWindow?.minimize();
          break;
        case 'maximize':
          if (this.mainWindow?.isMaximized()) {
            this.mainWindow.unmaximize();
          } else {
            this.mainWindow?.maximize();
          }
          break;
        case 'close':
          this.mainWindow?.close();
          break;
      }
    });
  }

  private handleWindowsClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

new WhisperIDEApp();