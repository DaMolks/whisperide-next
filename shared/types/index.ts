export interface ProjectConfig {
  name: string;
  type: 'local' | 'github';
  gitInit?: boolean;
  gitRemote?: {
    url: string;
    token: string;
    branch: string;
  };
}

export interface ProjectInfo {
  path: string;
  name: string;
  type: 'local' | 'github';
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
