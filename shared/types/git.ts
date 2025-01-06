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
  current: boolean;
  name: string;
  remoteTracking?: string;
}

export interface GitCommitInfo {
  hash: string;
  date: string;
  author: string;
  message: string;
}

export interface GitDiff {
  path: string;
  content: string;
  additions: number;
  deletions: number;
}

export interface GitRemote {
  name: string;
  url: string;
  fetch: boolean;
  push: boolean;
}