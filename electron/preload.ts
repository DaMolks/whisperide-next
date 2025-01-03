import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload script starting...');

contextBridge.exposeInMainWorld('electron', {
  minimize: () => {
    console.log('Sending minimize command...');
    ipcRenderer.send('window-control', 'minimize');
  },
  maximize: () => {
    console.log('Sending maximize command...');
    ipcRenderer.send('window-control', 'maximize');
  },
  close: () => {
    console.log('Sending close command...');
    ipcRenderer.send('window-control', 'close');
  }
});

console.log('Preload script finished...');