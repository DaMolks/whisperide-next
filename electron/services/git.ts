import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface GitInfo {
  isGitRepo: boolean;
  branch?: string;
  remotes?: string[];
  hasChanges?: boolean;
}

export class GitService {
  // Vérifie si un dossier est un dépôt git et récupère les infos
  static async getGitInfo(projectPath: string): Promise<GitInfo> {
    try {
      // Vérifie si le dossier .git existe
      const gitDir = path.join(projectPath, '.git');
      await fs.access(gitDir);

      // Récupère la branche actuelle
      const { stdout: branchOutput } = await execAsync('git branch --show-current', {
        cwd: projectPath
      });
      const branch = branchOutput.trim();

      // Récupère les remotes
      const { stdout: remoteOutput } = await execAsync('git remote', {
        cwd: projectPath
      });
      const remotes = remoteOutput.split('\n').filter(r => r.trim().length > 0);

      // Vérifie s'il y a des changements
      const { stdout: statusOutput } = await execAsync('git status --porcelain', {
        cwd: projectPath
      });
      const hasChanges = statusOutput.trim().length > 0;

      return {
        isGitRepo: true,
        branch,
        remotes,
        hasChanges
      };
    } catch (error) {
      return { isGitRepo: false };
    }
  }

  // Initialise un nouveau dépôt git
  static async initRepository(projectPath: string): Promise<void> {
    await execAsync('git init', { cwd: projectPath });
  }

  // Vérifie si git est installé
  static async isGitInstalled(): Promise<boolean> {
    try {
      await execAsync('git --version');
      return true;
    } catch {
      return false;
    }
  }
}