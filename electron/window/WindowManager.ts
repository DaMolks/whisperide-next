import { BrowserWindow, ipcMain } from 'electron';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private splashWindow: BrowserWindow | null = null;

  constructor() {
    this.setupWindowControls();
  }

  private setupWindowControls() {
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

  // ... reste du code WindowManager
}