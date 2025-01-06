declare namespace Electron {
  interface App {
    getPath(name: string): string;
    quit(): void;
    on(event: string, listener: Function): void;
    whenReady(): Promise<void>;
  }

  interface BrowserWindow {
    loadURL(url: string): Promise<void>;
    loadFile(path: string): Promise<void>;
    show(): void;
    close(): void;
    minimize(): void;
    maximize(): void;
    unmaximize(): void;
    isMaximized(): boolean;
    restore(): void;
    focus(): void;
    isMinimized(): boolean;
    webContents: WebContents;
  }

  interface WebContents {
    send(channel: string, ...args: any[]): void;
    on(event: string, listener: Function): void;
    openDevTools(): void;
  }

  interface IpcMain {
    on(channel: string, listener: (event: IpcMainEvent, ...args: any[]) => void): void;
    handle(channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any>): void;
  }

  interface IpcRenderer {
    on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void;
    send(channel: string, ...args: any[]): void;
    invoke(channel: string, ...args: any[]): Promise<any>;
  }

  interface IpcMainEvent {
    reply(channel: string, ...args: any[]): void;
  }

  interface IpcMainInvokeEvent {
    sender: WebContents;
  }

  interface IpcRendererEvent {
    sender: IpcRenderer;
  }

  interface Protocol {
    registerHttpProtocol(scheme: string, handler: (request: any, callback: any) => void): void;
  }
}

declare module 'electron' {
  const app: Electron.App;
  const BrowserWindow: typeof Electron.BrowserWindow;
  const ipcMain: Electron.IpcMain;
  const ipcRenderer: Electron.IpcRenderer;
  const protocol: Electron.Protocol;
  const contextBridge: {
    exposeInMainWorld(key: string, api: any): void;
  };

  export { app, BrowserWindow, ipcMain, ipcRenderer, protocol, contextBridge };
}