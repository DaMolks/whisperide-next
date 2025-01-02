import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

class WhisperIDEApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    app.on('ready', this.createMainWindow);
    app.on('window-all-closed', this.handleWindowsClosed);
    app.on('activate', this.onActivate);
    this.setupIPC();
  }

  private createMainWindow = () => {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      frame: false,
      show: true,
      backgroundColor: '#1a1a1a',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    const devIndexPath = path.join(__dirname, '../../dist/index.html');
    const prodIndexPath = path.join(__dirname, '../dist/index.html');

    let loadPath;
    if (fs.existsSync(devIndexPath)) {
      loadPath = `file://${devIndexPath}`;
    } else if (fs.existsSync(prodIndexPath)) {
      loadPath = `file://${prodIndexPath}`;
    } else {
      console.error('No index.html found');
      app.quit();
      return;
    }

    this.mainWindow.loadURL(loadPath);

    this.mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load page', errorDescription);
      app.quit();
    });

    this.mainWindow.webContents.on('did-finish-load', () => {
      this.mainWindow?.show();
    });
  }

  private setupIPC() {
    ipcMain.on('window-control', (event, command: string) => {
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

  private onActivate = () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createMainWindow();
    }
  }
}

app.commandLine.appendSwitch('enable-logging');
app.whenReady().then(() => {
  new WhisperIDEApp();
});