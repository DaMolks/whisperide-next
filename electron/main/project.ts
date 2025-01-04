import { ipcMain, dialog } from 'electron';
import { FileSystemService } from '../services/file-system';
import { ProjectManager } from '../services/project-manager';
import { GitService } from '../services/git';

export function setupProjectHandlers() {
  // Gestion des fichiers
  ipcMain.handle('list-files', (_, path) => FileSystemService.listFiles(path));
  ipcMain.handle('read-file', (_, path) => FileSystemService.readFile(path));
  ipcMain.handle('write-file', (_, path, content) => FileSystemService.writeFile(path, content));
  ipcMain.handle('create-file', (_, path) => FileSystemService.createFile(path));
  ipcMain.handle('create-directory', (_, path) => FileSystemService.createDirectory(path));
  ipcMain.handle('rename-file', (_, oldPath, newPath) => FileSystemService.rename(oldPath, newPath));
  ipcMain.handle('delete-file', (_, path) => FileSystemService.delete(path));

  // Sélection de dossier
  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    });
    return result.canceled ? null : result.filePaths[0];
  });

  // Gestion des projets
  ipcMain.handle('get-recent-projects', () => ProjectManager.getRecentProjects());
  ipcMain.handle('open-project', (_, path) => ProjectManager.openProject(path));
  ipcMain.handle('create-project', (_, path, config) => ProjectManager.createProject(path, config));

  // Fonctionnalités Git
  ipcMain.handle('git-is-installed', () => GitService.isGitInstalled());
  ipcMain.handle('git-info', (_, path) => GitService.getGitInfo(path));
  ipcMain.handle('git-status', (_, path) => GitService.getStatus(path));
  ipcMain.handle('git-stage', (_, path, files) => GitService.stage(path, files));
  ipcMain.handle('git-unstage', (_, path, files) => GitService.unstage(path, files));
  ipcMain.handle('git-commit', (_, path, message) => GitService.commit(path, message));
  ipcMain.handle('git-branches', (_, path) => GitService.getBranches(path));
  ipcMain.handle('git-create-branch', (_, path, name) => GitService.createBranch(path, name));
  ipcMain.handle('git-checkout', (_, path, branch) => GitService.checkout(path, branch));
  ipcMain.handle('git-history', (_, path, count) => GitService.getCommitHistory(path, count));
  ipcMain.handle('git-diff', (_, path, file) => GitService.getDiff(path, file));
}