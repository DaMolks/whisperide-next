import type { GitInfo } from './git';

export interface FileEntry {
  path: string;
  name: string;
  type: 'file' | 'directory';
}

export type ProjectType = 'local' | 'github';

export interface BaseConfig {
  name: string;
  type: ProjectType;
  description: string;
  version: string;
}

export interface ProjectConfig extends BaseConfig {
  gitInit?: boolean;
  gitRemote?: string;
}

export interface ProjectInfo extends BaseConfig {
  path: string;
  lastOpened?: string;
  gitInfo?: {
    branch: string;
    remote?: string;
  };
}