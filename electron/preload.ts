import { contextBridge, ipcRenderer } from 'electron';
import type { FileEntry, ProjectConfig, ProjectInfo,
  GitInfo, GitStatus, GitBranch, GitCommitInfo } from '@types/index';

type WindowElectronAPI = {
  // Rest of the code...
}