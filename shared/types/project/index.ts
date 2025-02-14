export type ProjectType = 'local' | 'github';

export interface BaseConfig {
  name: string;
  description?: string;
  version?: string;
  type: ProjectType;
}

export interface GitRemoteConfig {
  url: string;
  token: string;
  branch: string;
}

export interface GitConfig {
  gitInit?: boolean;
  gitRemote?: GitRemoteConfig;
}

export interface ProjectConfig extends BaseConfig, GitConfig {}

export interface ProjectInfo extends BaseConfig {
  path: string;
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
