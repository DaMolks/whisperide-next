import { BrowserWindow, ipcMain, protocol } from 'electron';
import * as path from 'path';
import { GitHubAuthService } from './github-auth';
import { ProjectService } from './project';
import { GitService } from './git';
import { FileService } from './file';

export class AppService {
  private mainWindow: BrowserWindow | null = null;

  async initialize() {
    this.registerProtocols();
    await this.createMainWindow();
    this.setupIPC();
  }

  createMainWindow() {
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
      this.mainWindow.loadURL('http://localhost:8080');
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../index.html'));
    }
    
    this.mainWindow.show();
  }

  focusMainWindow() {
    if (this.mainWindow) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
      }
      this.mainWindow.focus();
    }
  }

  private registerProtocols() {
    protocol.registerHttpProtocol('whisperide', (request, callback) => {
      const url = request.url;
      if (url.includes('/oauth/callback')) {
        this.mainWindow?.webContents.send('oauth-callback', url);
      }
    });
  }

  private setupIPC() {
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
    ipcMain.handle('open-project', (event, path) => ProjectService.openProject(path));
    ipcMain.handle('create-project', (event, { path, config }) => 
      ProjectService.createProject(path, config));

    // Git Operations
    ipcMain.handle('git-is-installed', () => GitService.isGitInstalled());
    ipcMain.handle('git-info', (event, path) => GitService.getGitInfo(path));
    ipcMain.handle('git-status', (event, path) => GitService.getStatus(path));
    ipcMain.handle('git-stage', (event, path, files) => GitService.stage(path, files));
    ipcMain.handle('git-unstage', (event, path, files) => GitService.unstage(path, files));
    ipcMain.handle('git-commit', (event, path, message) => GitService.commit(path, message));
    ipcMain.handle('git-branches', (event, path) => GitService.getBranches(path));
    ipcMain.handle('git-create-branch', (event, path, name) => 
      GitService.createBranch(path, name));
    ipcMain.handle('git-checkout', (event, path, branch) => 
      GitService.checkout(path, branch));
    ipcMain.handle('git-history', (event, path, count) => 
      GitService.getCommitHistory(path, count));
    ipcMain.handle('git-diff', (event, path, file) => GitService.getDiff(path, file));

    // File Operations
    ipcMain.handle('list-files', (event, path) => FileService.list(path));
    ipcMain.handle('read-file', (event, path) => FileService.read(path));
    ipcMain.handle('write-file', (event, path, content) => 
      FileService.write(path, content));
    ipcMain.handle('create-file', (event, path) => FileService.createFile(path));
    ipcMain.handle('create-directory', (event, path) => 
      FileService.createDirectory(path));
    ipcMain.handle('rename-file', (event, oldPath, newPath) => 
      FileService.rename(oldPath, newPath));
    ipcMain.handle('delete-file', (event, path) => FileService.delete(path));
  }
}