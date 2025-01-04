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

export interface ProjectSettings {
  name: string;
  description?: string;
  version?: string;
}