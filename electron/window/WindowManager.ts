import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private splashWindow: BrowserWindow | null = null;

  async createSplashWindow(): Promise<void> {
    this.splashWindow = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    await this.splashWindow.loadFile('public/splash.html');
  }

  async createMainWindow(): Promise<void> {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      frame: false,
      backgroundColor: '#121212',
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    const isDev = process.env.NODE_ENV === 'development';
    const url = isDev ? 'http://localhost:8080' : `file://${path.join(__dirname, '../dist/index.html')}`;
    
    await this.mainWindow.loadURL(url);
    
    if (isDev) {
      this.mainWindow.webContents.openDevTools();
    }

    // Window controls
    ipcMain.on('minimize-window', () => {
      this.mainWindow?.minimize();
    });

    ipcMain.on('maximize-window', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
    });

    ipcMain.on('close-window', () => {
      this.mainWindow?.close();
    });

    // When ready, show window and close splash
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
      setTimeout(() => {
        this.splashWindow?.close();
      }, 1000);
    });
  }

  closeSplashWindow(): void {
    if (this.splashWindow) {
      this.splashWindow.close();
      this.splashWindow = null;
    }
  }
}