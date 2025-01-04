import { ipcMain, dialog, app } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import type { ProjectInfo, ProjectSettings } from '../../shared/types';

const execAsync = promisify(exec);

export function setupProjectHandlers() {
  // Sélectionner un dossier
  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    return result.canceled ? null : result.filePaths[0];
  });

  // Lire les paramètres du projet
  ipcMain.handle('read-project-settings', async (_, projectPath: string) => {
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(content);
      
      return {
        name: packageJson.name,
        description: packageJson.description,
        version: packageJson.version
      } as ProjectSettings;
    } catch {
      // Si pas de package.json, retourne un objet vide
      return {} as ProjectSettings;
    }
  });

  // Cloner un dépôt
  ipcMain.handle('clone-repository', async (_, options: {
    url: string;
    token: string;
    path: string;
  }) => {
    const repoName = options.url.split('/').pop()?.replace('.git', '');
    const projectPath = path.join(options.path, repoName!);

    // Configure Git pour utiliser le token
    const gitUrl = options.url.replace(
      'https://',
      `https://x-access-token:${options.token}@`
    );

    try {
      await execAsync(`git clone ${gitUrl} ${projectPath}`);
      return projectPath;
    } catch (error) {
      console.error('Clone error:', error);
      throw new Error('Failed to clone repository');
    }
  });

  // Obtenir le dossier des projets
  ipcMain.handle('get-projects-directory', async () => {
    const userDataPath = app.getPath('userData');
    const projectsPath = path.join(userDataPath, 'projects');
    
    try {
      await fs.mkdir(projectsPath, { recursive: true });
    } catch {}
    
    return projectsPath;
  });

  // Récents projets
  const RECENT_PROJECTS_FILE = path.join(
    app.getPath('userData'),
    'recent-projects.json'
  );

  ipcMain.handle('get-recent-projects', async () => {
    try {
      const content = await fs.readFile(RECENT_PROJECTS_FILE, 'utf-8');
      return JSON.parse(content) as ProjectInfo[];
    } catch {
      return [];
    }
  });

  ipcMain.handle('add-recent-project', async (_, project: ProjectInfo) => {
    try {
      let projects = [] as ProjectInfo[];
      
      try {
        const content = await fs.readFile(RECENT_PROJECTS_FILE, 'utf-8');
        projects = JSON.parse(content);
      } catch {}

      // Ajoute ou met à jour le projet
      const index = projects.findIndex(p => p.path === project.path);
      if (index !== -1) {
        projects[index] = project;
      } else {
        projects.unshift(project);
      }

      // Garde uniquement les 10 projets les plus récents
      projects = projects.slice(0, 10);

      await fs.writeFile(
        RECENT_PROJECTS_FILE,
        JSON.stringify(projects, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Error saving recent project:', error);
      throw error;
    }
  });
}