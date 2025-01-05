import { exec } from 'child_process';
import { promisify } from 'util';
import type { GitBranch, GitCommitInfo, GitInfo, GitStatus } from '@shared/types/git';

const execAsync = promisify(exec);

export class GitService {
  static async isGitInstalled(): Promise<boolean> {
    try {
      await execAsync('git --version');
      return true;
    } catch {
      return false;
    }
  }

  static async getGitInfo(projectPath: string): Promise<GitInfo> {
    try {
      await execAsync('git rev-parse --is-inside-work-tree', { cwd: projectPath });

      const { stdout: branchOutput } = await execAsync('git branch --show-current', {
        cwd: projectPath
      });

      const { stdout: remoteOutput } = await execAsync('git remote', {
        cwd: projectPath
      });

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

  static async init(projectPath: string): Promise<void> {
    await execAsync('git init', { cwd: projectPath });
  }

  static async getStatus(projectPath: string): Promise<GitStatus> {
    const { stdout } = await execAsync('git status --porcelain -b', {
      cwd: projectPath
    });

    const lines = stdout.split('\n');
    const branchLine = lines[0];
    const statusLines = lines.slice(1);

    const branchMatch = branchLine.match(/^## ([^.\.]+)(?:\.\.\.\S+ \[(ahead (\d+))?(, )?(behind (\d+))?\])?$/);
    const branch = branchMatch?.[1] || 'HEAD detached';
    const ahead = branchMatch?.[3] ? parseInt(branchMatch[3]) : 0;
    const behind = branchMatch?.[6] ? parseInt(branchMatch[6]) : 0;

    const staged: string[] = [];
    const modified: string[] = [];
    const untracked: string[] = [];

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

  static async stage(projectPath: string, files: string[]): Promise<void> {
    if (files.length === 0) return;
    await execAsync(`git add ${files.map(f => `"${f}"`).join(' ')}`, {
      cwd: projectPath
    });
  }

  static async unstage(projectPath: string, files: string[]): Promise<void> {
    if (files.length === 0) return;
    await execAsync(`git reset HEAD ${files.map(f => `"${f}"`).join(' ')}`, {
      cwd: projectPath
    });
  }

  static async commit(projectPath: string, message: string): Promise<void> {
    await execAsync(`git commit -m "${message.replace(/"/g, '\"')}"`, {
      cwd: projectPath
    });
  }

  static async getBranches(projectPath: string): Promise<GitBranch[]> {
    const { stdout } = await execAsync('git branch -vv', { cwd: projectPath });
    
    return stdout.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const match = line.match(/^([*] |  )(\S+)\s+\S+(?:\s+\[(\S+)\])?/);
        if (!match) return null;

        const [, isCurrent, name, remoteTracking] = match;
        return {
          current: isCurrent === '* ',
          name,
          remoteTracking
        };
      })
      .filter((branch): branch is GitBranch => branch !== null);
  }

  static async createBranch(projectPath: string, name: string): Promise<void> {
    await execAsync(`git checkout -b "${name}"`, { cwd: projectPath });
  }

  static async checkout(projectPath: string, branch: string): Promise<void> {
    await execAsync(`git checkout "${branch}"`, { cwd: projectPath });
  }

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

  static async getDiff(projectPath: string, file: string): Promise<string> {
    const { stdout } = await execAsync(`git diff "${file}"`, {
      cwd: projectPath
    });
    return stdout;
  }
}