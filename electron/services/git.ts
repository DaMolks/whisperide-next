import { exec } from 'child_process';
import { promisify } from 'util';
import type { GitBranch, GitCommitInfo, GitInfo, GitStatus } from '@types/index';

const execAsync = promisify(exec);

export class GitService {
  // Rest of the code...
}