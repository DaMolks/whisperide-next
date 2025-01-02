import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

class WhisperIDEApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    app.on('ready', this.createWindow);
    app.on('window-all-closed', this.handleWindowsClosed);
    this.setupIPC();
  }

  private setupIPC() {
    ipcMain.on('window-control', (_, command) => {
      console.log('Received command:', command); // Debug log
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

  private createWindow = () => {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('Loading development URL');
      this.mainWindow.loadURL('http://localhost:8080');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../index.html'));
    }
  }

  private handleWindowsClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

new WhisperIDEApp();