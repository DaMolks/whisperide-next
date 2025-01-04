import * as fs from 'fs/promises';
import * as path from 'path';
import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { GitService, GitInfo } from './git';

export interface ProjectInfo {
  id: string;
  name: string;
  path: string;
  type: 'local' | 'github';
  lastOpened: string;
  gitInfo?: GitInfo;
}

export interface ProjectConfig {
  name?: string;
  description?: string;
  version?: string;
}

export class ProjectManager {
  private static async getProjectsFile(): Promise<string> {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'projects.json');
  }

  // Charge les projets récents
  static async getRecentProjects(): Promise<ProjectInfo[]> {
    try {
      const projectsFile = await this.getProjectsFile();
      const content = await fs.readFile(projectsFile, 'utf-8');
      const projects = JSON.parse(content) as ProjectInfo[];

      // Vérifie si les projets existent toujours et met à jour les infos git
      const validProjects = [];
      for (const project of projects) {
        try {
          await fs.access(project.path);
          project.gitInfo = await GitService.getGitInfo(project.path);
          validProjects.push(project);
        } catch {
          // Le projet n'existe plus, on le skip
        }
      }

      return validProjects;
    } catch {
      return [];
    }
  }

  // Ouvre un projet existant
  static async openProject(projectPath: string): Promise<ProjectInfo> {
    // Vérifie si le dossier existe
    await fs.access(projectPath);

    // Essaie de lire package.json pour les infos du projet
    let config: ProjectConfig = {};
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      config = JSON.parse(content);
    } catch {
      // Pas de package.json, on utilise les valeurs par défaut
    }

    // Récupère les infos git
    const gitInfo = await GitService.getGitInfo(projectPath);

    const project: ProjectInfo = {
      id: uuidv4(),
      name: config.name || path.basename(projectPath),
      path: projectPath,
      type: 'local',
      lastOpened: new Date().toISOString(),
      gitInfo
    };

    await this.addToRecentProjects(project);
    return project;
  }

  // Crée un nouveau projet
  static async createProject(projectPath: string, config: ProjectConfig = {}): Promise<ProjectInfo> {
    // Crée le dossier du projet
    await fs.mkdir(projectPath, { recursive: true });

    // Crée un package.json basique
    const packageJson = {
      name: config.name || path.basename(projectPath),
      description: config.description || '',
      version: config.version || '0.1.0'
    };

    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Initialise le dépôt git si git est installé
    const gitInstalled = await GitService.isGitInstalled();
    if (gitInstalled) {
      await GitService.initRepository(projectPath);
    }

    return this.openProject(projectPath);
  }

  // Ajoute un projet à la liste des récents
  private static async addToRecentProjects(project: ProjectInfo): Promise<void> {
    const projects = await this.getRecentProjects();

    // Supprime le projet s'il existe déjà
    const index = projects.findIndex(p => p.path === project.path);
    if (index !== -1) {
      projects.splice(index, 1);
    }

    // Ajoute le projet en tête de liste
    projects.unshift(project);

    // Garde uniquement les 10 projets les plus récents
    const recentProjects = projects.slice(0, 10);

    // Sauvegarde la liste
    const projectsFile = await this.getProjectsFile();
    await fs.writeFile(projectsFile, JSON.stringify(recentProjects, null, 2));
  }
}