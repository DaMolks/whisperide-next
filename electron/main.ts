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

    const possiblePaths = [
      path.join(__dirname, '../../src/splash/splash.html'),
      path.join(__dirname, '../dist/splash.html'),
      path.join(__dirname, '../dist/dist/splash.html')
    ];

    const splashPath = possiblePaths.find(p => fs.existsSync(p));

    if (splashPath) {
      console.log('Loading splash screen from:', splashPath);
      this.splashWindow.loadFile(splashPath);
    } else {
      console.error('Splash screen HTML not found in any of these locations:', possiblePaths);
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
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    const possiblePaths = [
      path.join(__dirname, '../../src/index.html'),
      path.join(__dirname, '../dist/index.html'),
      path.join(__dirname, '../dist/dist/index.html')
    ];

    const indexPath = possiblePaths.find(p => fs.existsSync(p));

    if (indexPath) {
      console.log('Loading main window from:', indexPath);
      if (process.env.NODE_ENV === 'development') {
        this.mainWindow.loadURL('http://localhost:8080');
      } else {
        this.mainWindow.loadFile(indexPath);
      }
    } else {
      console.error('Index HTML not found in any of these locations:', possiblePaths);
    }

    this.mainWindow.once('ready-to-show', () => {
      this.splashWindow?.close();
      this.mainWindow?.show();
    });

    // Debugging
    this.mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load page', errorCode, errorDescription);
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