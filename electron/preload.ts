import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  minimize: () => ipcRenderer.send('window-control', 'minimize'),
  maximize: () => ipcRenderer.send('window-control', 'maximize'),
  close: () => ipcRenderer.send('window-control', 'close'),
  githubAuth: {
    login: () => new Promise((resolve, reject) => {
      ipcRenderer.send('github-auth');
      
      ipcRenderer.once('github-auth-complete', (_, data) => {
        resolve(data.token);
      });

      ipcRenderer.once('github-auth-error', (_, data) => {
        reject(new Error(data.error));
      });
    })
  }
});