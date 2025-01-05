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