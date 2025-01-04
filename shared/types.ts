export interface ProjectInfo {
  id: string;
  name: string;
  path: string;
  type: 'github' | 'local';
  lastOpened: string;
  // Spécifique à GitHub
  githubUrl?: string;
  defaultBranch?: string;
}

export interface ProjectConfig {
  name: string;
  description?: string;
  version?: string;
}

export interface ProjectMode {
  mode: 'github' | 'local';
  githubToken?: string;
}

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileEntry[];
  gitStatus?: 'modified' | 'untracked' | 'staged' | null;
}