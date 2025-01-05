export interface BaseProjectConfig {
  name: string;
  type: 'local' | 'github';
  description?: string;
  version?: string;
}

export interface GitConfig {
  gitInit?: boolean;
  gitRemote?: {
    url: string;
    token: string;
    branch: string;
  };
}

export interface ProjectConfig extends BaseProjectConfig, GitConfig {}

export interface GitInfo {
  branch: string;
  remote?: string;
}

export interface ProjectInfo extends BaseProjectConfig {
  path: string;
  lastOpened?: string;
  gitInfo?: GitInfo;
}

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileEntry[];
  gitStatus?: 'modified' | 'untracked' | 'staged' | null;
}

export * from './git';
