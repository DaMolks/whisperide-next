const { BrowserWindow, ipcMain } = require('electron');
import type { IpcMainEvent } from 'electron';
import * as path from 'path';

export class WindowManager {
  private static windows: Map<string, BrowserWindow> = new Map();

  static createWindow(name: string, options: Electron.BrowserWindowConstructorOptions): BrowserWindow {
    const window = new BrowserWindow(options);
    this.windows.set(name, window);
    return window;
  }

  static setupWindowControls() {
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

  static getWindow(name: string): BrowserWindow | undefined {
    return this.windows.get(name);
  }

  static closeWindow(name: string) {
    const window = this.getWindow(name);
    if (window) {
      window.close();
      this.windows.delete(name);
    }
  }

  static closeAllWindows() {
    for (const [name, window] of this.windows) {
      window.close();
      this.windows.delete(name);
    }
  }
}