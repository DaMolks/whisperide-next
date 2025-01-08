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

  // Rest of the code remains the same...