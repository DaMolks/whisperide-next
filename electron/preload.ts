import { contextBridge, ipcRenderer } from 'electron';
import type { ProjectInfo, ProjectSettings, CloneOptions } from './types';

contextBridge.exposeInMainWorld('electron', {
  close: () => ipcRenderer.send('window-close'),
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  
  // GitHub APIs
  githubAuth: {
    login: () => ipcRenderer.invoke('github-auth-login')
  },

  // Project management APIs
  readProjectSettings: async (path: string): Promise<ProjectSettings> => 
    ipcRenderer.invoke('read-project-settings', path),
  
  cloneRepository: async (options: CloneOptions): Promise<string> => 
    ipcRenderer.invoke('clone-repository', options),
  
  getProjectsDirectory: async (): Promise<string> => 
    ipcRenderer.invoke('get-projects-directory'),
  
  getRecentProjects: async (): Promise<ProjectInfo[]> => 
    ipcRenderer.invoke('get-recent-projects'),
  
  addRecentProject: async (project: ProjectInfo): Promise<void> => 
    ipcRenderer.invoke('add-recent-project', project),

  selectDirectory: async (): Promise<string | null> => 
    ipcRenderer.invoke('select-directory')
});

declare global {
  interface Window {
    electron: typeof contextBridge.exposeInMainWorld extends 
      { exposeInMainWorld: (key: string, api: infer T) => void } ? T : never;
  }
}