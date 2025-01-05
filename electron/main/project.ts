const { ipcMain, dialog } = require('electron');
import type { IpcMainInvokeEvent } from '../types/electron';
import * as path from 'path';
import type { ProjectConfig } from '@shared/types';
import { FileSystemService } from '../services/file-system';
import { GitService } from '../services/git';
import { ProjectService } from '../services/project';

export function setupProjectHandlers() {
  // Fichiers
  ipcMain.handle('list-files', async (_: IpcMainInvokeEvent, dirPath: string) => {
    return FileSystemService.listFiles(dirPath);
  });

  ipcMain.handle('read-file', async (_: IpcMainInvokeEvent, filePath: string) => {
    return FileSystemService.readFile(filePath);
  });

  ipcMain.handle('write-file', async (_: IpcMainInvokeEvent, filePath: string, content: string) => {
    return FileSystemService.writeFile(filePath, content);
  });

  ipcMain.handle('create-file', async (_: IpcMainInvokeEvent, filePath: string) => {
    return FileSystemService.createFile(filePath);
  });

  ipcMain.handle('create-directory', async (_: IpcMainInvokeEvent, dirPath: string) => {
    return FileSystemService.createDirectory(dirPath);
  });

  ipcMain.handle('rename-file', async (_: IpcMainInvokeEvent, oldPath: string, newPath: string) => {
    return FileSystemService.rename(oldPath, newPath);
  });

  ipcMain.handle('delete-file', async (_: IpcMainInvokeEvent, filePath: string) => {
    return FileSystemService.delete(filePath);
  });

  // Git
  ipcMain.handle('git-is-installed', async () => GitService.isGitInstalled());
  
  ipcMain.handle('git-info', async (_: IpcMainInvokeEvent, dirPath: string) => {
    return GitService.getGitInfo(dirPath);
  });

  ipcMain.handle('git-status', async (_: IpcMainInvokeEvent, dirPath: string) => {
    return GitService.getStatus(dirPath);
  });

  ipcMain.handle('git-stage', async (_: IpcMainInvokeEvent, dirPath: string, files: string[]) => {
    return GitService.stage(dirPath, files);
  });

  ipcMain.handle('git-unstage', async (_: IpcMainInvokeEvent, dirPath: string, files: string[]) => {
    return GitService.unstage(dirPath, files);
  });

  ipcMain.handle('git-commit', async (_: IpcMainInvokeEvent, dirPath: string, message: string) => {
    return GitService.commit(dirPath, message);
  });

  ipcMain.handle('git-branches', async (_: IpcMainInvokeEvent, dirPath: string) => {
    return GitService.getBranches(dirPath);
  });

  ipcMain.handle('git-create-branch', async (_: IpcMainInvokeEvent, dirPath: string, name: string) => {
    return GitService.createBranch(dirPath, name);
  });

  ipcMain.handle('git-checkout', async (_: IpcMainInvokeEvent, dirPath: string, branch: string) => {
    return GitService.checkout(dirPath, branch);
  });

  ipcMain.handle('git-history', async (_: IpcMainInvokeEvent, dirPath: string, count?: number) => {
    return GitService.getCommitHistory(dirPath, count);
  });

  ipcMain.handle('git-diff', async (_: IpcMainInvokeEvent, dirPath: string, file: string) => {
    return GitService.getDiff(dirPath, file);
  });

  // Projets
  ipcMain.handle('open-project', async (_: IpcMainInvokeEvent, dirPath: string) => {
    return ProjectService.openProject(dirPath);
  });

  ipcMain.handle('create-project', async (_: IpcMainInvokeEvent, dirPath: string, config: ProjectConfig) => {
    return ProjectService.createProject(dirPath, config);
  });

  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    });
    return result.canceled ? null : result.filePaths[0];
  });
}