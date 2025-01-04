import { ProjectInfo, ProjectConfig } from '../../shared/types';
import { GitInfo, GitStatus, GitBranch, GitCommitInfo } from '../services/git';
import { FileEntry } from '../services/file-system';

declare global {
  interface Window {
    electron: {
      // Window controls
      close: () => void;
      minimize: () => void;
      maximize: () => void;

      // GitHub auth
      githubAuth: {
        login: () => Promise<string>;
      };

      // Project management
      projects: {
        getRecent: () => Promise<ProjectInfo[]>;
        open: (path: string) => Promise<ProjectInfo>;
        create: (path: string, config?: ProjectConfig) => Promise<ProjectInfo>;
        selectDirectory: () => Promise<string | null>;
      };

      // Git operations
      git: {
        isInstalled: () => Promise<boolean>;
        getInfo: (path: string) => Promise<GitInfo>;
        getStatus: (path: string) => Promise<GitStatus>;
        stage: (path: string, files: string[]) => Promise<void>;
        unstage: (path: string, files: string[]) => Promise<void>;
        commit: (path: string, message: string) => Promise<void>;
        getBranches: (path: string) => Promise<GitBranch[]>;
        createBranch: (path: string, name: string) => Promise<void>;
        checkout: (path: string, branch: string) => Promise<void>;
        getCommitHistory: (path: string, count?: number) => Promise<GitCommitInfo[]>;
        getDiff: (path: string, file: string) => Promise<string>;
      };

      // File system operations
      files: {
        list: (path: string) => Promise<FileEntry[]>;
        read: (path: string) => Promise<string>;
        write: (path: string, content: string) => Promise<void>;
        createFile: (path: string) => Promise<void>;
        createDirectory: (path: string) => Promise<void>;
        rename: (oldPath: string, newPath: string) => Promise<void>;
        delete: (path: string) => Promise<void>;
      };
    };
  }
}