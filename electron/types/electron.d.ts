declare namespace Electron {
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

  interface BaseEvent {
    preventDefault(): void;
    sender: WebContents;
  }

  interface IpcMainEvent extends BaseEvent {
    reply(channel: string, ...args: any[]): void;
  }

  interface IpcRendererEvent extends BaseEvent {
    sender: IpcRenderer;
  }

  interface IpcMainInvokeEvent {
    sender: WebContents;
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

  interface Protocol {
    registerHttpProtocol(scheme: string, handler: (request: any, callback: any) => void): void;
  }

  class BrowserWindow {
    constructor(options?: BrowserWindowConstructorOptions);
    static getAllWindows(): BrowserWindow[];

    webContents: WebContents;
    id: number;

    loadURL(url: string): Promise<void>;
    loadFile(path: string): Promise<void>;
    show(): void;
    close(): void;
    hide(): void;
    minimize(): void;
    maximize(): void;
    unmaximize(): void;
    isMaximized(): boolean;
    isMinimized(): boolean;
    restore(): void;
    focus(): void;
    blur(): void;
    on(event: string, listener: Function): void;
  }

  interface App {
    requestSingleInstanceLock(): boolean;
    setAsDefaultProtocolClient(protocol: string, execPath?: string): boolean;
    getPath(name: string): string;
    quit(): void;
    on(event: string, listener: Function): void;
    whenReady(): Promise<void>;
  }
}

declare module 'electron' {
  const app: Electron.App;
  const BrowserWindow: typeof Electron.BrowserWindow;
  const ipcMain: Electron.IpcMain;
  const ipcRenderer: Electron.IpcRenderer;
  const protocol: Electron.Protocol;
  const Event: typeof Electron.BaseEvent;
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