contextBridge.exposeInMainWorld('electron', {
  window: {
    close: () => ipcRenderer.send('window-close'),
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize')
  },
  
  githubAuth: {
    login: () => ipcRenderer.invoke('github-auth-login')
  },

  projects: {
    getRecent: () => ipcRenderer.invoke('get-recent-projects'),
    open: (path: string) => ipcRenderer.invoke('open-project', path),
    create: (path: string, config?: ProjectConfig) => 
      ipcRenderer.invoke('create-project', { path, config }),
    selectDirectory: () => ipcRenderer.invoke('select-directory')
  },

  git: {
    isInstalled: () => ipcRenderer.invoke('git-is-installed'),
    getInfo: (path: string) => ipcRenderer.invoke('git-info', path),
    getStatus: (path: string) => ipcRenderer.invoke('git-status', path),
    stage: (path: string, files: string[]) => 
      ipcRenderer.invoke('git-stage', path, files),
    unstage: (path: string, files: string[]) => 
      ipcRenderer.invoke('git-unstage', path, files),
    commit: (path: string, message: string) => 
      ipcRenderer.invoke('git-commit', path, message),
    getBranches: (path: string) => 
      ipcRenderer.invoke('git-branches', path),
    createBranch: (path: string, name: string) => 
      ipcRenderer.invoke('git-create-branch', path, name),
    checkout: (path: string, branch: string) => 
      ipcRenderer.invoke('git-checkout', path, branch),
    getCommitHistory: (path: string, count?: number) => 
      ipcRenderer.invoke('git-history', path, count),
    getDiff: (path: string, file: string) => 
      ipcRenderer.invoke('git-diff', path, file)
  },

  files: {
    list: (path: string) => 
      ipcRenderer.invoke('list-files', path),
    read: (path: string) => 
      ipcRenderer.invoke('read-file', path),
    write: (path: string, content: string) => 
      ipcRenderer.invoke('write-file', path, content),
    createFile: (path: string) => 
      ipcRenderer.invoke('create-file', path),
    createDirectory: (path: string) => 
      ipcRenderer.invoke('create-directory', path),
    rename: (oldPath: string, newPath: string) => 
      ipcRenderer.invoke('rename-file', oldPath, newPath),
    delete: (path: string) => 
      ipcRenderer.invoke('delete-file', path)
  }
});