import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

class WhisperIDEApp {
  private mainWindow: BrowserWindow | null = null;
  private splashWindow: BrowserWindow | null = null;

  constructor() {
    app.on('ready', this.init);
    app.on('window-all-closed', this.handleWindowsClosed);
    app.on('activate', this.onActivate);
    this.setupIPC();
  }

  private init = () => {
    this.createSplashWindow();
    this.createMainWindow();
  }

  private findIndexFile(filename: string) {
    const possiblePaths = [
      path.join(__dirname, '../dist/' + filename),
      path.join(__dirname, '../dist/dist/' + filename),
      path.join(process.cwd(), 'dist/' + filename),
      path.join(process.cwd(), 'dist/dist/' + filename)
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }

    console.error(`Could not find ${filename} in any expected location`);
    return null;
  }

  private createSplashWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    this.splashWindow = new BrowserWindow({
      width: 400,
      height: 300,
      x: Math.round((width - 400) / 2),
      y: Math.round((height - 300) / 2),
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      show: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    const splashPath = this.findIndexFile('splash.html');
    if (splashPath) {
      this.splashWindow.loadFile(splashPath);
    } else {
      console.error('Could not load splash screen');
    }
  }

  private createMainWindow = () => {
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

    const indexPath = this.findIndexFile('index.html');
    if (indexPath) {
      this.mainWindow.loadFile(indexPath);
    } else {
      console.error('Could not load main window');
    }

    this.mainWindow.once('ready-to-show', () => {
      this.splashWindow?.close();
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

new WhisperIDEApp();