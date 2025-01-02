import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload script executing'); // Debug log

contextBridge.exposeInMainWorld('electron', {
  minimize: () => {
    console.log('Minimize called'); // Debug log
    ipcRenderer.send('window-control', 'minimize');
  },
  maximize: () => {
    console.log('Maximize called'); // Debug log
    ipcRenderer.send('window-control', 'maximize');
  },
  close: () => {
    console.log('Close called'); // Debug log
    ipcRenderer.send('window-control', 'close');
  },
});