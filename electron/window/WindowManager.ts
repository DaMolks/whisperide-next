import { BrowserWindow, screen } from 'electron';
import * as path from 'path';

export class WindowManager {
  private splashWindow: BrowserWindow | null = null;
  private mainWindow: BrowserWindow | null = null;

  async createSplashScreen(): Promise<void> {
    const display = screen.getPrimaryDisplay();
    const width = 400;
    const height = 300;

    this.splashWindow = new BrowserWindow({
      width,
      height,
      x: (display.bounds.width - width) / 2,
      y: (display.bounds.height - height) / 2,
      frame: false,
      transparent: true,
      resizable: false,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    await this.splashWindow.loadFile(path.join(__dirname, '../splash.html'));
  }

  async createMainWindow(): Promise<void> {
    const display = screen.getPrimaryDisplay();

    this.mainWindow = new BrowserWindow({
      width: Math.min(1440, display.bounds.width * 0.8),
      height: Math.min(900, display.bounds.height * 0.8),
      minWidth: 800,
      minHeight: 600,
      frame: false,
      backgroundColor: '#1a1a1a',
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this.mainWindow.center();
    await this.mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }

  async transitionToMain(): Promise<void> {
    if (!this.mainWindow || !this.splashWindow) return;

    this.mainWindow.show();
    this.splashWindow.close();
    this.splashWindow = null;
  }

  closeSplash(): void {
    if (this.splashWindow) {
      this.splashWindow.close();
      this.splashWindow = null;
    }
  }

  closeMain(): void {
    if (this.mainWindow) {
      this.mainWindow.close();
      this.mainWindow = null;
    }
  }
}