const { BrowserWindow, ipcMain } = require('electron');
import type { IpcMainEvent } from '../types/electron';

type WindowOptions = {
  width: number;
  height: number;
  frame?: boolean;
  show?: boolean;
  backgroundColor?: string;
  webPreferences?: {
    nodeIntegration?: boolean;
    contextIsolation?: boolean;
    preload?: string;
  };
};

export class WindowManager {
  private static windows = new Map<string, typeof BrowserWindow>();

  static createWindow(name: string, options: WindowOptions): typeof BrowserWindow {
    const window = new BrowserWindow(options);
    this.windows.set(name, window);
    return window;
  }

  static setupWindowControls(): void {
    ipcMain.on('window-control', (_: IpcMainEvent, command: 'minimize' | 'maximize' | 'close') => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (!focusedWindow) return;

      switch (command) {
        case 'minimize':
          focusedWindow.minimize();
          break;
        case 'maximize':
          focusedWindow.isMaximized()
            ? focusedWindow.unmaximize()
            : focusedWindow.maximize();
          break;
        case 'close':
          focusedWindow.close();
          break;
      }
    });
  }

  static getWindow(name: string): typeof BrowserWindow | undefined {
    return this.windows.get(name);
  }

  static closeWindow(name: string): void {
    const window = this.getWindow(name);
    if (window) {
      window.close();
      this.windows.delete(name);
    }
  }

  static closeAllWindows(): void {
    for (const [name, window] of this.windows) {
      window.close();
      this.windows.delete(name);
    }
  }
}