import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload script is running');

contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data?: any) => {
    console.log(`Sending on channel ${channel}:`, data);
    let validChannels = ['window-control'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    } else {
      console.error(`Invalid channel: ${channel}`);
    }
  },
  minimize: () => {
    console.log('Minimize method called');
    ipcRenderer.send('window-control', 'minimize');
  },
  maximize: () => {
    console.log('Maximize method called');
    ipcRenderer.send('window-control', 'maximize');
  },
  close: () => {
    console.log('Close method called');
    ipcRenderer.send('window-control', 'close');
  },
  receive: (channel: string, func: Function) => {
    console.log(`Setting up receive for channel ${channel}`);
    let validChannels = ['window-control-response'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});