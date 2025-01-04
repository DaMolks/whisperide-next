import { ipcMain, dialog } from 'electron';
import { ProjectManager } from './services/project-manager';
import { GitService } from './services/git';

export function setupProjectHandlers() {
  // Récupérer les projets récents
  ipcMain.handle('get-recent-projects', async () => {
    return ProjectManager.getRecentProjects();
  });

  // Ouvrir un projet existant
  ipcMain.handle('open-project', async (_, projectPath: string) => {
    return ProjectManager.openProject(projectPath);
  });

  // Créer un nouveau projet
  ipcMain.handle('create-project', async (_, projectPath: string, config = {}) => {
    return ProjectManager.createProject(projectPath, config);
  });

  // Sélectionner un dossier
  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    });

    if (result.canceled) return null;
    return result.filePaths[0];
  });

  // Vérifier si git est installé
  ipcMain.handle('check-git', async () => {
    return GitService.isGitInstalled();
  });

  // Récupérer les infos git d'un projet
  ipcMain.handle('get-git-info', async (_, projectPath: string) => {
    return GitService.getGitInfo(projectPath);
  });
}