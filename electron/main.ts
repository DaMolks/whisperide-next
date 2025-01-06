import { app, BrowserWindow, ipcMain, protocol, dialog } from 'electron';
import type { IpcMainEvent } from 'electron';
import * as path from 'path';
import { GitHubAuthService } from './services/github-auth';
import { ProjectService } from './services/project';
import { GitService } from './services/git';
import { FileService } from './services/file';

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
        nodeIntegration: false,
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
    // Window Controls
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

    // Directory Selection
    ipcMain.handle('select-directory', async () => {
      if (!this.mainWindow) return null;

      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openDirectory', 'createDirectory'],
        title: 'Sélectionner un dossier de projet',
      });

      if (result.canceled) return null;
      return result.filePaths[0];
    });

    // GitHub Authentication
    ipcMain.handle('github-auth-login', async () => {
      try {
        const token = await GitHubAuthService.authorize();
        return token;
      } catch (error) {
        throw error;
      }
    });

    // Project Management
    ipcMain.handle('get-recent-projects', async () => {
      try {
        return await ProjectService.getRecentProjects();
      } catch (error) {
        console.error('Error getting recent projects:', error);
        throw error;
      }
    });

    ipcMain.handle('create-project', async (event, { path, config }) => {
      try {
        return await ProjectService.createProject(path, config);
      } catch (error) {
        console.error('Error creating project:', error);
        throw error;
      }
    });

    ipcMain.handle('open-project', async (event, path) => {
      try {
        return await ProjectService.openProject(path);
      } catch (error) {
        console.error('Error opening project:', error);
        throw error;
      }
    });

    // Git Operations
    ipcMain.handle('git-is-installed', () => GitService.isGitInstalled());
    ipcMain.handle('git-info', (event, path) => GitService.getGitInfo(path));
    ipcMain.handle('git-status', (event, path) => GitService.getStatus(path));
    ipcMain.handle('git-stage', (event, path, files) => GitService.stage(path, files));
    ipcMain.handle('git-unstage', (event, path, files) => GitService.unstage(path, files));
    ipcMain.handle('git-commit', (event, path, message) => GitService.commit(path, message));
    ipcMain.handle('git-branches', (event, path) => GitService.getBranches(path));
    ipcMain.handle('git-create-branch', (event, path, name) => GitService.createBranch(path, name));
    ipcMain.handle('git-checkout', (event, path, branch) => GitService.checkout(path, branch));
    ipcMain.handle('git-history', (event, path, count) => GitService.getCommitHistory(path, count));
    ipcMain.handle('git-diff', (event, path, file) => GitService.getDiff(path, file));

    // File Operations
    ipcMain.handle('list-files', (event, path) => FileService.list(path));
    ipcMain.handle('read-file', (event, path) => FileService.read(path));
    ipcMain.handle('write-file', (event, path, content) => FileService.write(path, content));
    ipcMain.handle('create-file', (event, path) => FileService.createFile(path));
    ipcMain.handle('create-directory', (event, path) => FileService.createDirectory(path));
    ipcMain.handle('rename-file', (event, oldPath, newPath) => FileService.rename(oldPath, newPath));
    ipcMain.handle('delete-file', (event, path) => FileService.delete(path));
  }

  private handleWindowsClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

new WhisperIDEApp();