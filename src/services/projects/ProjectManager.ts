import { v4 as uuidv4 } from 'uuid';
import { ProjectInfo, ProjectSettings } from '../../shared/types';

export class ProjectManager {
  // Ouvre un projet local
  static async openLocalProject(path: string): Promise<ProjectInfo> {
    const settings = await window.electron.readProjectSettings(path);
    const projectInfo: ProjectInfo = {
      id: uuidv4(),
      name: settings.name || path.split('/').pop() || 'Unnamed Project',
      path,
      type: 'local',
      lastOpened: new Date().toISOString()
    };
    
    await this.saveProjectToRecents(projectInfo);
    return projectInfo;
  }

  // Clone et ouvre un projet GitHub
  static async cloneAndOpenGithubRepo(repo: any, token: string): Promise<ProjectInfo> {
    const projectPath = await window.electron.cloneRepository({
      url: repo.html_url,
      token,
      path: await window.electron.getProjectsDirectory()
    });

    const projectInfo: ProjectInfo = {
      id: uuidv4(),
      name: repo.name,
      path: projectPath,
      type: 'github',
      githubUrl: repo.html_url,
      defaultBranch: repo.default_branch,
      lastOpened: new Date().toISOString()
    };

    await this.saveProjectToRecents(projectInfo);
    return projectInfo;
  }

  // Récupère les projets récents
  static async getRecentProjects(): Promise<ProjectInfo[]> {
    try {
      return await window.electron.getRecentProjects();
    } catch (error) {
      console.error('Error loading recent projects:', error);
      return [];
    }
  }

  // Sauvegarde un projet dans les récents
  private static async saveProjectToRecents(project: ProjectInfo): Promise<void> {
    try {
      await window.electron.addRecentProject(project);
    } catch (error) {
      console.error('Error saving recent project:', error);
    }
  }
}