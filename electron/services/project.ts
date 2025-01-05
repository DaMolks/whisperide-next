import * as fs from 'fs/promises';
import * as path from 'path';
import type { ProjectConfig, ProjectInfo } from '@shared/types';
import { GitService } from './git';

interface ExtendedProjectConfig extends ProjectConfig {
  gitInit?: boolean;
  type: 'local' | 'github';
}

interface ExtendedProjectInfo extends ProjectInfo {
  gitInfo?: {
    branch: string;
    remote?: string;
  };
}

export class ProjectService {
  static async readProjectSettings(projectPath: string): Promise<ExtendedProjectConfig> {
    try {
      const configPath = path.join(projectPath, '.whisperide', 'config.json');
      const content = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {
        name: path.basename(projectPath),
        type: 'local'
      };
    }
  }

  static async createProject(projectPath: string, config?: ExtendedProjectConfig): Promise<ExtendedProjectInfo> {
    await fs.mkdir(path.join(projectPath, '.whisperide'), { recursive: true });

    const projectConfig: ExtendedProjectConfig = {
      name: config?.name || path.basename(projectPath),
      type: config?.type || 'local',
      gitInit: config?.gitInit
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
      path: projectPath,
      name: projectConfig.name,
      type: projectConfig.type,
      gitInfo: gitInfo.isGitRepo ? {
        branch: gitInfo.branch || 'main',
        remote: gitInfo.remotes?.[0]
      } : undefined
    };
  }

  static async openProject(projectPath: string): Promise<ExtendedProjectInfo> {
    const config = await this.readProjectSettings(projectPath);
    const gitInfo = await GitService.getGitInfo(projectPath);

    return {
      path: projectPath,
      name: config.name,
      type: config.type,
      gitInfo: gitInfo.isGitRepo ? {
        branch: gitInfo.branch || 'main',
        remote: gitInfo.remotes?.[0]
      } : undefined
    };
  }
}