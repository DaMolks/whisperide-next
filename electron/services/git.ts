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

export interface GitStatus {
  staged: string[];
  modified: string[];
  untracked: string[];
  branch: string;
  ahead: number;
  behind: number;
}

export interface GitBranch {
  name: string;
  current: boolean;
  remoteTracking?: string;
}

export interface GitCommitInfo {
  hash: string;
  date: string;
  author: string;
  message: string;
}

export class GitService {
  // Vérifie si git est installé
  static async isGitInstalled(): Promise<boolean> {
    try {
      await execAsync('git --version');
      return true;
    } catch {
      return false;
    }
  }

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

      // Récupère les remotes
      const { stdout: remoteOutput } = await execAsync('git remote', {
        cwd: projectPath
      });

      // Vérifie s'il y a des changements
      const { stdout: statusOutput } = await execAsync('git status --porcelain', {
        cwd: projectPath
      });

      return {
        isGitRepo: true,
        branch: branchOutput.trim(),
        remotes: remoteOutput.split('\n').filter(r => r.trim()),
        hasChanges: statusOutput.trim().length > 0
      };
    } catch {
      return { isGitRepo: false };
    }
  }

  // Récupère le status détaillé du dépôt
  static async getStatus(projectPath: string): Promise<GitStatus> {
    const { stdout: statusOutput } = await execAsync('git status --porcelain -b', {
      cwd: projectPath
    });

    const lines = statusOutput.split('\n');
    const branchLine = lines[0]; // First line contains branch info
    const statusLines = lines.slice(1);

    // Parse branch info
    const branchMatch = branchLine.match(/## ([^.\.]+)(?:\.\.\.\S+ \[(ahead (\d+))?(, )?(behind (\d+))?\])?/);
    const branch = branchMatch ? branchMatch[1] : 'HEAD detached';
    const ahead = branchMatch && branchMatch[3] ? parseInt(branchMatch[3]) : 0;
    const behind = branchMatch && branchMatch[6] ? parseInt(branchMatch[6]) : 0;

    const staged = [];
    const modified = [];
    const untracked = [];

    for (const line of statusLines) {
      if (!line) continue;
      const status = line.slice(0, 2);
      const file = line.slice(3);

      if (status[0] !== ' ' && status[0] !== '?') staged.push(file);
      if (status[1] !== ' ') modified.push(file);
      if (status[0] === '?') untracked.push(file);
    }

    return { staged, modified, untracked, branch, ahead, behind };
  }

  // Initialise un nouveau dépôt
  static async init(projectPath: string): Promise<void> {
    await execAsync('git init', { cwd: projectPath });
  }

  // Stage des fichiers
  static async stage(projectPath: string, files: string[]): Promise<void> {
    if (files.length === 0) return;
    await execAsync(`git add ${files.map(f => `"${f}"`).join(' ')}`, {
      cwd: projectPath
    });
  }

  // Unstage des fichiers
  static async unstage(projectPath: string, files: string[]): Promise<void> {
    if (files.length === 0) return;
    await execAsync(`git reset HEAD ${files.map(f => `"${f}"`).join(' ')}`, {
      cwd: projectPath
    });
  }

  // Crée un commit
  static async commit(projectPath: string, message: string): Promise<void> {
    await execAsync(`git commit -m "${message.replace(/"/g, '\"')}"`, {
      cwd: projectPath
    });
  }

  // Récupère la liste des branches
  static async getBranches(projectPath: string): Promise<GitBranch[]> {
    const { stdout } = await execAsync('git branch -vv', { cwd: projectPath });
    
    return stdout.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const match = line.match(/^([*] |  )(\S+)\s+\S+(?:\s+\[(\S+)\])?/);
        if (!match) return null;
        
        return {
          current: match[1] === '* ',
          name: match[2],
          remoteTracking: match[3]
        };
      })
      .filter((branch): branch is GitBranch => branch !== null);
  }

  // Crée une nouvelle branche
  static async createBranch(projectPath: string, name: string): Promise<void> {
    await execAsync(`git checkout -b "${name}"`, { cwd: projectPath });
  }

  // Change de branche
  static async checkout(projectPath: string, branch: string): Promise<void> {
    await execAsync(`git checkout "${branch}"`, { cwd: projectPath });
  }

  // Récupère l'historique des commits
  static async getCommitHistory(projectPath: string, count = 50): Promise<GitCommitInfo[]> {
    const { stdout } = await execAsync(
      `git log -n ${count} --pretty=format:"%H|%ai|%an|%s"`,
      { cwd: projectPath }
    );

    return stdout.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [hash, date, author, message] = line.split('|');
        return { hash, date, author, message };
      });
  }

  // Récupère le diff d'un fichier
  static async getDiff(projectPath: string, file: string): Promise<string> {
    const { stdout } = await execAsync(`git diff "${file}"`, {
      cwd: projectPath
    });
    return stdout;
  }
}