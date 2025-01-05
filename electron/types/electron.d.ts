declare namespace Electron {
  interface IpcMainEvent {
    reply: (channel: string, ...args: any[]) => void;
    sender: any;
  }

  interface IpcMainInvokeEvent extends IpcMainEvent {
    sender: any;
  }

  interface BrowserWindowConstructorOptions {
    width?: number;
    height?: number;
    frame?: boolean;
    show?: boolean;
    backgroundColor?: string;
    webPreferences?: {
      nodeIntegration?: boolean;
      contextIsolation?: boolean;
      preload?: string;
      devTools?: boolean;
    };
  }

  interface Process extends NodeJS.Process {
    defaultApp?: boolean;
  }
}

declare module 'electron' {
  const app: {
    on(event: string, listener: (...args: any[]) => void): void;
    quit(): void;
    isDefaultProtocolClient(protocol: string): boolean;
    setAsDefaultProtocolClient(protocol: string): void;
  };

  const BrowserWindow: {
    new(options: Electron.BrowserWindowConstructorOptions): BrowserWindow;
    getFocusedWindow(): BrowserWindow | null;
  };

  const ipcMain: {
    on(channel: string, listener: (event: Electron.IpcMainEvent, ...args: any[]) => void): void;
    handle(channel: string, listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<any>): void;
  };

  const dialog: {
    showOpenDialog(options: any): Promise<{ canceled: boolean; filePaths: string[] }>;
  };

  export { app, BrowserWindow, ipcMain, dialog };
}