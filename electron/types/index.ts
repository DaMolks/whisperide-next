export interface ProjectInfo {
  id: string;
  name: string;
  path: string;
  type: 'github' | 'local';
  lastOpened: string;
  githubUrl?: string;
  defaultBranch?: string;
}

export interface ProjectSettings {
  name: string;
  description?: string;
  version?: string;
}

export interface CloneOptions {
  url: string;
  token: string;
  path: string;
}