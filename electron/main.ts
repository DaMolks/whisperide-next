import { app, BrowserWindow, ipcMain, screen, protocol } from 'electron';
import * as path from 'path';
import * as url from 'url';

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
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'splash-preload.js')
      }
    });

    const splashPath = url.format({
      pathname: path.join(__dirname, '../dist/splash.html'),
      protocol: 'file:',
      slashes: true
    });

    this.splashWindow.loadURL(splashPath);
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

    const indexPath = url.format({
      pathname: path.join(__dirname, '../dist/index.html'),
      protocol: 'file:',
      slashes: true
    });

    this.mainWindow.loadURL(indexPath);

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

app.commandLine.appendSwitch('enable-logging');
app.whenReady().then(() => {
  new WhisperIDEApp();
});