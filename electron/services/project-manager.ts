import * as fs from 'fs/promises';
import * as path from 'path';
import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { GitService } from './git';
import type { GitInfo } from '@shared/types/git';

export interface ProjectManagerInfo {
  id: string;
  name: string;
  path: string;
  type: 'local' | 'github';
  lastOpened: string;
  gitInfo?: GitInfo;
}

export interface ProjectManagerConfig {
  name?: string;
  description?: string;
  version?: string;
}

export class ProjectManager {
  private static async getProjectsFile(): Promise<string> {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'projects.json');
  }

  static async getRecentProjects(): Promise<ProjectManagerInfo[]> {
    try {
      const projectsFile = await this.getProjectsFile();
      const content = await fs.readFile(projectsFile, 'utf-8');
      const projects = JSON.parse(content) as ProjectManagerInfo[];

      const validProjects = [];
      for (const project of projects) {
        try {
          await fs.access(project.path);
          const gitInfo = await GitService.getGitInfo(project.path);
          project.gitInfo = gitInfo;
          validProjects.push(project);
        } catch {
          // Project doesn't exist anymore, skip it
        }
      }

      return validProjects;
    } catch {
      return [];
    }
  }

  static async openProject(projectPath: string): Promise<ProjectManagerInfo> {
    await fs.access(projectPath);

    let config: ProjectManagerConfig = {};
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      config = JSON.parse(content);
    } catch {
      // No package.json, use defaults
    }

    const gitInfo = await GitService.getGitInfo(projectPath);

    const project: ProjectManagerInfo = {
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

  static async createProject(projectPath: string, config: ProjectManagerConfig = {}): Promise<ProjectManagerInfo> {
    await fs.mkdir(projectPath, { recursive: true });

    const packageJson = {
      name: config.name || path.basename(projectPath),
      description: config.description || '',
      version: config.version || '0.1.0'
    };

    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    const gitInstalled = await GitService.isGitInstalled();
    if (gitInstalled) {
      await GitService.init(projectPath);
    }

    return this.openProject(projectPath);
  }

  private static async addToRecentProjects(project: ProjectManagerInfo): Promise<void> {
    const projects = await this.getRecentProjects();

    const index = projects.findIndex(p => p.path === project.path);
    if (index !== -1) {
      projects.splice(index, 1);
    }

    projects.unshift(project);
    const recentProjects = projects.slice(0, 10);

    const projectsFile = await this.getProjectsFile();
    await fs.writeFile(projectsFile, JSON.stringify(recentProjects, null, 2));
  }
}
