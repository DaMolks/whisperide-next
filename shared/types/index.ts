export interface ProjectConfig {
  name: string;
  type: 'local' | 'github';
  description?: string;
  version?: string;
  gitInit?: boolean;
  gitRemote?: {
    url: string;
    token: string;
    branch: string;
  };
}

export interface ProjectInfo extends Pick<ProjectConfig, 'name' | 'type' | 'description' | 'version'> {
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

export * from './git';
