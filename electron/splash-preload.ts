const { contextBridge } = require('electron');

export {};

declare global {
  interface Window {
    splash: {
      updateStatus: (message: string) => void;
    };
  }
}

contextBridge.exposeInMainWorld('splash', {
  updateStatus: (message: string) => {
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = message;
    }
  }
});