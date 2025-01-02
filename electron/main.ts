import { app, BrowserWindow, ipcMain } from 'electron';

class WhisperIDEApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.setupIPC();
  }

  private setupIPC() {
    ipcMain.on('window-close', () => {
      this.mainWindow?.close();
    });

    ipcMain.on('window-minimize', () => {
      this.mainWindow?.minimize();
    });

    ipcMain.on('window-maximize', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
    });
  }

  private createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      frame: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });
  }
}

app.whenReady().then(() => new WhisperIDEApp());