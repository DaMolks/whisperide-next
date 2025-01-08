import { BrowserWindow, ipcMain, protocol, type IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import { GitHubAuthService } from './github-auth';
import { ProjectService } from './project';
import { GitService } from './git';
import { FileService } from './file';
import type { ProjectConfig } from '@shared/types';

interface ProtocolRequest {
  url: string;
  referrer: string;
  method: string;
  uploadData?: unknown[];
}

interface ProtocolResponse {
  error?: number;
  statusCode?: number;
  data?: Buffer | string | ReadableStream;
  headers?: Record<string, string | string[]>;
  mimeType?: string;
  charset?: string;
}

export class AppService {
  private mainWindow: Electron.BrowserWindow | null = null;

  async initialize(): Promise<void> {
    this.registerProtocols();
    await this.createMainWindow();
    this.setupIPC();
  }

  createMainWindow(): void {
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
      void this.mainWindow?.loadURL('http://localhost:8080').catch(console.error);
    } else {
      void this.mainWindow?.loadFile(path.join(__dirname, '../index.html')).catch(console.error);
    }
    
    this.mainWindow?.show();
  }

  focusMainWindow(): void {
    if (this.mainWindow) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
      }
      this.mainWindow.focus();
    }
  }

  private registerProtocols(): void {
    protocol.registerHttpProtocol('whisperide', (request: ProtocolRequest, callback: (response: ProtocolResponse) => void) => {
      const url = request.url;
      if (url.includes('/oauth/callback')) {
        this.mainWindow?.webContents.send('oauth-callback', url);
      }
    });
  }

  private setupIPC(): void {
    // Window Controls
    ipcMain.on('window-close', () => this.mainWindow?.close());
    ipcMain.on('window-minimize', () => this.mainWindow?.minimize());
    ipcMain.on('window-maximize', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
    });

    // GitHub Authentication
    ipcMain.handle('github-auth-login', () => GitHubAuthService.authorize());

    // Project Management
    ipcMain.handle('get-recent-projects', () => ProjectService.getRecentProjects());
    
    ipcMain.handle('open-project', 
      (event: IpcMainInvokeEvent, path: string) => ProjectService.openProject(path));
    
    ipcMain.handle('create-project', 
      (event: IpcMainInvokeEvent, { path, config }: { path: string; config: ProjectConfig }) => 
        ProjectService.createProject(path, config));

    // Git Operations
    ipcMain.handle('git-is-installed', () => GitService.isGitInstalled());
    ipcMain.handle('git-info', (event: IpcMainInvokeEvent, path: string) => GitService.getGitInfo(path));
    ipcMain.handle('git-status', (event: IpcMainInvokeEvent, path: string) => GitService.getStatus(path));
    ipcMain.handle('git-stage', (event: IpcMainInvokeEvent, path: string, files: string[]) => 
      GitService.stage(path, files));
    ipcMain.handle('git-unstage', (event: IpcMainInvokeEvent, path: string, files: string[]) => 
      GitService.unstage(path, files));
    ipcMain.handle('git-commit', (event: IpcMainInvokeEvent, path: string, message: string) => 
      GitService.commit(path, message));
    ipcMain.handle('git-branches', (event: IpcMainInvokeEvent, path: string) => 
      GitService.getBranches(path));
    ipcMain.handle('git-create-branch', (event: IpcMainInvokeEvent, path: string, name: string) => 
      GitService.createBranch(path, name));
    ipcMain.handle('git-checkout', (event: IpcMainInvokeEvent, path: string, branch: string) => 
      GitService.checkout(path, branch));
    ipcMain.handle('git-history', (event: IpcMainInvokeEvent, path: string, count: number) => 
      GitService.getCommitHistory(path, count));
    ipcMain.handle('git-diff', (event: IpcMainInvokeEvent, path: string, file: string) => 
      GitService.getDiff(path, file));

    // File Operations
    ipcMain.handle('list-files', (event: IpcMainInvokeEvent, path: string) => 
      FileService.list(path));
    ipcMain.handle('read-file', (event: IpcMainInvokeEvent, path: string) => 
      FileService.read(path));
    ipcMain.handle('write-file', (event: IpcMainInvokeEvent, path: string, content: string) => 
      FileService.write(path, content));
    ipcMain.handle('create-file', (event: IpcMainInvokeEvent, path: string) => 
      FileService.createFile(path));
    ipcMain.handle('create-directory', (event: IpcMainInvokeEvent, path: string) => 
      FileService.createDirectory(path));
    ipcMain.handle('rename-file', (event: IpcMainInvokeEvent, oldPath: string, newPath: string) => 
      FileService.rename(oldPath, newPath));
    ipcMain.handle('delete-file', (event: IpcMainInvokeEvent, path: string) => 
      FileService.delete(path));
  }
}