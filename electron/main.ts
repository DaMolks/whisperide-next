import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import type { IpcMainEvent } from 'electron';
import * as path from 'path';
import { GitHubAuthService } from './services/github-auth';
import { ProjectService } from './services/project';

interface ProtocolRequest {
  url: string;
  referrer: string;
  method: string;
  uploadData?: any[];
}

interface ProtocolResponse {
  error?: number;
  statusCode?: number;
  data?: Buffer | string | ReadableStream;
  headers?: Record<string, string | string[]>;
  mimeType?: string;
  charset?: string;
}

class WhisperIDEApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    app.on('ready', this.init);
    app.on('window-all-closed', this.handleWindowsClosed);
    this.setupIPC();
  }

  private init = () => {
    this.registerProtocol();
    this.createMainWindow();
  }

  private registerProtocol() {
    if (!app.isDefaultProtocolClient('whisperide')) {
      app.setAsDefaultProtocolClient('whisperide');
    }

    protocol.registerHttpProtocol('whisperide', (request: ProtocolRequest, callback: (response: ProtocolResponse) => void) => {
      const url = request.url;
      if (url.includes('/oauth/callback')) {
        this.mainWindow?.webContents.send('oauth-callback', url);
      }
    });
  }

  private createMainWindow = async () => {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      frame: false,
      show: false,
      backgroundColor: '#1a1a1a',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    if (process.env.NODE_ENV === 'development') {
      await this.mainWindow.loadURL('http://localhost:8080');
    } else {
      await this.mainWindow.loadFile(path.join(__dirname, '../index.html'));
    }
    
    this.mainWindow.show();
  }

  private setupIPC() {
    // Gestionnaires GitHub
    ipcMain.on('github-auth', async (event: IpcMainEvent, ...args: any[]) => {
      try {
        const token = await GitHubAuthService.authorize();
        event.reply('github-auth-complete', { token });
      } catch (error) {
        if (error instanceof Error) {
          event.reply('github-auth-error', { error: error.message });
        } else {
          event.reply('github-auth-error', { error: 'Unknown error occurred' });
        }
      }
    });

    // Gestionnaires de fenêtre
    ipcMain.on('window-control', (event: IpcMainEvent, command: string) => {
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

    // Gestionnaires de projets
    ipcMain.handle('get-recent-projects', async () => {
      try {
        return await ProjectService.getRecentProjects();
      } catch (error) {
        console.error('Error getting recent projects:', error);
        throw error;
      }
    });

    ipcMain.handle('create-project', async (event, { path, config }: { path: string; config: any }) => {
      try {
        return await ProjectService.createProject(path, config);
      } catch (error) {
        console.error('Error creating project:', error);
        throw error;
      }
    });

    ipcMain.handle('open-project', async (event, path: string) => {
      try {
        return await ProjectService.openProject(path);
      } catch (error) {
        console.error('Error opening project:', error);
        throw error;
      }
    });
  }

  private handleWindowsClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

new WhisperIDEApp();