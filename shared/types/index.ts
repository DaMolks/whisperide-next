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

export interface ProjectInfo {
  path: string;
  name: string;
  type: 'local' | 'github';
  gitInfo?: {
    branch: string;
    remote?: string;
  };
}

export interface ProjectConfig {
  name: string;
  type: 'local' | 'github';
  gitInit?: boolean;
}