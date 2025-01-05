// Git Types
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

export interface GitInfo {
  isGitRepo: boolean;
  branch?: string;
  remotes?: string[];
  hasChanges?: boolean;
}

// Project Types
export type ProjectType = 'local' | 'github';

export interface BaseConfig {
  name: string;
  type: ProjectType;
}

export interface ProjectConfig extends BaseConfig {
  description?: string;
  version?: string;
  gitInit?: boolean;
  gitRemote?: {
    url: string;
    token: string;
    branch: string;
  };
}

export interface ProjectInfo extends BaseConfig {
  path: string;
  description?: string;
  version?: string;
  lastOpened?: string;
  gitInfo?: {
    branch: string;
    remote?: string;
  };
}

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileEntry[];
  gitStatus?: 'modified' | 'untracked' | 'staged' | null;
}
