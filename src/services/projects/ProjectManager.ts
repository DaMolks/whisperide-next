import { v4 as uuidv4 } from 'uuid';
import { ProjectInfo, ProjectConfig } from '@shared/types';

interface GitHubRepo {
  name: string;
  html_url: string;
  default_branch: string;
}

export class ProjectManager {
  // Ouvre un projet local
  static async openLocalProject(path: string): Promise<ProjectInfo> {
    const project = await window.electron.projects.open(path);
    await this.saveProjectToRecents(project);
    return project;
  }

  // Clone et ouvre un projet GitHub
  static async cloneAndOpenGithubRepo(repo: GitHubRepo, token: string): Promise<ProjectInfo> {
    // Récupère le chemin racine des projets
    const projectsDir = await window.electron.projects.selectDirectory();
    if (!projectsDir) {
      throw new Error('No directory selected');
    }

    // Crée le projet
    const config: ProjectConfig = {
      name: repo.name,
      type: 'github',
      gitInit: true,
      gitRemote: {
        url: repo.html_url,
        token,
        branch: repo.default_branch
      }
    };

    const project = await window.electron.projects.create(projectsDir, config);
    await this.saveProjectToRecents(project);
    return project;
  }

  // Récupère les projets récents
  static async getRecentProjects(): Promise<ProjectInfo[]> {
    try {
      return await window.electron.projects.getRecent();
    } catch (error) {
      console.error('Error loading recent projects:', error);
      return [];
    }
  }

  // Filtre les projets récents par type
  static async getRecentProjectsByType(type: 'local' | 'github'): Promise<ProjectInfo[]> {
    const projects = await this.getRecentProjects();
    return projects.filter(project => project.type === type);
  }

  // Sauvegarde un projet dans les récents
  private static async saveProjectToRecents(project: ProjectInfo): Promise<void> {
    try {
      // La gestion des projets récents est maintenant gérée par le main process
      // via le preload
      await window.electron.projects.open(project.path);
    } catch (error) {
      console.error('Error saving recent project:', error);
      throw error;
    }
  }
}