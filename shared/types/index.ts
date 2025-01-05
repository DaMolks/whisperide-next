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

import { GitInfo } from './git';
export { GitInfo };

export interface ProjectConfig extends BaseConfig, GitConfig {
  type: ProjectType;
}

export interface ProjectInfo extends BaseConfig {
  path: string;
  type: ProjectType;
  lastOpened?: string;
  gitInfo?: Pick<GitInfo, 'branch' | 'remotes'>;
}

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileEntry[];
  gitStatus?: 'modified' | 'untracked' | 'staged' | null;
}

export * from './git';
