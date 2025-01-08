import * as fs from 'fs/promises';
import * as path from 'path';
import { app } from 'electron';
import type { ProjectInfo } from '@shared/types';
import type { GitInfo } from '@shared/types/git';

export class ProjectManager {
  private static readonly CONFIG_DIR = path.join(app.getPath('userData'), 'projects');
  private static readonly CONFIG_FILE = path.join(ProjectManager.CONFIG_DIR, 'projects.json');

  static async initialize(): Promise<void> {
    await fs.mkdir(this.CONFIG_DIR, { recursive: true });
  }

  static async getRecentProjects(): Promise<ProjectInfo[]> {
    try {
      const content = await fs.readFile(this.CONFIG_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  static async saveProject(project: ProjectInfo): Promise<void> {
    const projects = await this.getRecentProjects();
    const existingIndex = projects.findIndex(p => p.path === project.path);

    if (existingIndex !== -1) {
      projects[existingIndex] = project;
    } else {
      projects.unshift(project);
    }

    await fs.writeFile(
      this.CONFIG_FILE,
      JSON.stringify(projects.slice(0, 10), null, 2)
    );
  }
}