declare namespace Electron {
  interface IpcMainEvent {
    reply: (channel: string, ...args: any[]) => void;
    sender: any;
  }

  interface IpcMainInvokeEvent extends IpcMainEvent {
    sender: any;
  }

  interface Event {
    preventDefault(): void;
    sender: any;
  }

  interface BrowserWindowConstructorOptions {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
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

  interface BrowserWindow {
    loadURL(url: string): Promise<void>;
    loadFile(filepath: string): Promise<void>;
    on(event: string, callback: (...args: any[]) => void): void;
    show(): void;
    minimize(): void;
    maximize(): void;
    unmaximize(): void;
    close(): void;
    isMaximized(): boolean;
    webContents: {
      send(channel: string, ...args: any[]): void;
    };
  }
}

declare module 'electron' {
  export type IpcMainEvent = Electron.IpcMainEvent;
  export type IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
  export type Event = Electron.Event;
  export type BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
  export type BrowserWindow = Electron.BrowserWindow;

  export const app: {
    on(event: string, listener: (...args: any[]) => void): void;
    quit(): void;
    getPath(name: string): string;
    isDefaultProtocolClient(protocol: string): boolean;
    setAsDefaultProtocolClient(protocol: string, execPath?: string, args?: string[]): boolean;
    whenReady(): Promise<void>;
  };

  export const ipcMain: {
    on(channel: string, listener: (event: IpcMainEvent, ...args: any[]) => void): void;
    handle(channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): void;
  };

  export class BrowserWindow {
    constructor(options: BrowserWindowConstructorOptions);
    static getFocusedWindow(): BrowserWindow | null;
    loadURL(url: string): Promise<void>;
    loadFile(filepath: string): Promise<void>;
    on(event: string, callback: (...args: any[]) => void): void;
    show(): void;
    minimize(): void;
    maximize(): void;
    unmaximize(): void;
    close(): void;
    isMaximized(): boolean;
    webContents: {
      send(channel: string, ...args: any[]): void;
    };
  }
}
