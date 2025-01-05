export type ProjectType = 'local' | 'github';

export interface BaseConfig {
  name: string;
  description?: string;
  version?: string;
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

export interface GitInfo {
  branch: string;
  remote?: string;
}

export interface ProjectConfig extends BaseConfig {
  type: ProjectType;
  gitInit?: boolean;
  gitRemote?: GitRemoteConfig;
}

export interface ProjectInfo extends BaseConfig {
  path: string;
  type: ProjectType;
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
