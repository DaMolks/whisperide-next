import * as fs from 'fs/promises';
import * as path from 'path';
import type { ProjectConfig, ProjectInfo, FileEntry } from '../../shared/types';
import { GitService } from './git';

export interface ExtendedProjectInfo extends ProjectInfo {
  id: string;
  lastOpened: string;
}

export class ProjectService {
  static async getRecentProjects(): Promise<ExtendedProjectInfo[]> {
    const configPath = path.join(process.env.APPDATA || process.env.HOME || '', '.whisperide', 'recent.json');
    try {
      const content = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  static async readProjectSettings(projectPath: string): Promise<ProjectConfig> {
    try {
      const configPath = path.join(projectPath, '.whisperide', 'config.json');
      const content = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {
        name: path.basename(projectPath),
        type: 'local',
        description: '',
        version: '0.1.0'
      };
    }
  }

  static async createProject(projectPath: string, config?: Partial<ProjectConfig>): Promise<ExtendedProjectInfo> {
    await fs.mkdir(path.join(projectPath, '.whisperide'), { recursive: true });

    const projectConfig: ProjectConfig = {
      name: config?.name || path.basename(projectPath),
      type: config?.type || 'local',
      description: config?.description || '',
      version: config?.version || '0.1.0',
      gitInit: config?.gitInit,
      gitRemote: config?.gitRemote
    };

    await fs.writeFile(
      path.join(projectPath, '.whisperide', 'config.json'),
      JSON.stringify(projectConfig, null, 2)
    );

    if (projectConfig.gitInit) {
      await GitService.init(projectPath);
    }

    const gitInfo = await GitService.getGitInfo(projectPath);
    
    return {
      id: Math.random().toString(36).substring(7),
      path: projectPath,
      name: projectConfig.name,
      type: projectConfig.type,
      description: projectConfig.description,
      version: projectConfig.version,
      lastOpened: new Date().toISOString(),
      gitInfo: gitInfo.isGitRepo ? {
        branch: gitInfo.branch || 'main',
        remote: gitInfo.remotes?.[0]
      } : undefined
    };
  }

  static async listFiles(dirPath: string): Promise<FileEntry[]> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.map(entry => ({
      path: path.join(dirPath, entry.name),
      name: entry.name,
      type: entry.isDirectory() ? 'directory' : 'file'
    }));
  }

  static async openProject(projectPath: string): Promise<ExtendedProjectInfo> {
    const config = await this.readProjectSettings(projectPath);
    const gitInfo = await GitService.getGitInfo(projectPath);

    return {
      id: Math.random().toString(36).substring(7),
      path: projectPath,
      name: config.name,
      type: config.type,
      description: config.description,
      version: config.version,
      lastOpened: new Date().toISOString(),
      gitInfo: gitInfo.isGitRepo ? {
        branch: gitInfo.branch || 'main',
        remote: gitInfo.remotes?.[0]
      } : undefined
    };
  }
}