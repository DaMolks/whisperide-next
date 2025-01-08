// Git types
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

// Project types
export interface ProjectConfig {
  name: string;
  type: ProjectType;
  description: string;
  version: string;
  gitInit?: boolean;
  gitRemote?: string;
}

export type ProjectType = 'local' | 'github';

export interface ProjectInfo extends ProjectConfig {
  path: string;
  lastOpened?: string;
  gitInfo?: {
    branch: string;
    remote?: string;
  };
}

// File types
export interface FileEntry {
  path: string;
  name: string;
  type: 'file' | 'directory';
}