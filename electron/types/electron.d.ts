declare namespace Electron {
  interface App {
    getPath(name: string): string;
    quit(): void;
    on(event: string, listener: Function): void;
    whenReady(): Promise<void>;
    requestSingleInstanceLock(): boolean;
    setAsDefaultProtocolClient(protocol: string): boolean;
  }

  type BrowserWindow = InstanceType<typeof BrowserWindow>;

  class BrowserWindow {
    constructor(options: BrowserWindowConstructorOptions);
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

  interface BrowserWindowConstructorOptions {
    width?: number;
    height?: number;
    frame?: boolean;
    show?: boolean;
    backgroundColor?: string;
    webPreferences?: WebPreferences;
  }

  interface WebPreferences {
    nodeIntegration?: boolean;
    contextIsolation?: boolean;
    preload?: string;
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

  interface Event {
    preventDefault: () => void;
    sender: WebContents;
  }

  interface IpcMainEvent extends Event {
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
  const Event: typeof Electron.Event;
  const IpcMainEvent: typeof Electron.IpcMainEvent;
  const IpcMainInvokeEvent: typeof Electron.IpcMainInvokeEvent;
  const contextBridge: {
    exposeInMainWorld(key: string, api: any): void;
  };

  export { 
    app, 
    BrowserWindow, 
    Event,
    IpcMainEvent,
    IpcMainInvokeEvent,
    ipcMain, 
    ipcRenderer, 
    protocol, 
    contextBridge 
  };
}