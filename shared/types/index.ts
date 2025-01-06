export * from './git';

export interface FileEntry {
  path: string;
  name: string;
  type: 'file' | 'directory';
}

export type ProjectType = 'local' | 'github';

export interface ProjectConfig {
  name: string;
  type: ProjectType;
  description: string;
  version: string;
  gitInit?: boolean;
  gitRemote?: string;
}

export interface ProjectInfo extends ProjectConfig {
  path: string;
  lastOpened?: string;
  gitInfo?: {
    branch: string;
    remote?: string;
  };
}