export * from './git';
export * from './file-system';

export interface ProjectInfo {
  path: string;
  name: string;
  type: 'local' | 'github';
  gitInfo?: {
    branch: string;
    remote?: string;
  };
}

export interface ProjectConfig {
  name: string;
  type: 'local' | 'github';
  gitInit?: boolean;
}