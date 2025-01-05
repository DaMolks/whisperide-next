declare namespace Electron {
  interface Event {
    preventDefault(): void;
    sender: any;
  }

  interface IpcMainEvent extends Event {
    reply: (channel: string, ...args: any[]) => void;
  }

  interface IpcMainInvokeEvent extends IpcMainEvent {}

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

  interface WebContents {
    send(channel: string, ...args: any[]): void;
  }

  interface BrowserWindow {
    webContents: WebContents;
    loadURL(url: string): Promise<void>;
    loadFile(filepath: string): Promise<void>;
    on(event: string, callback: (...args: any[]) => void): void;
    show(): void;
    minimize(): void;
    maximize(): void;
    unmaximize(): void;
    close(): void;
    isMaximized(): boolean;
  }
}

declare module 'electron' {
  export interface BrowserWindow extends Electron.BrowserWindow {}
  export const BrowserWindow: {
    new(options: Electron.BrowserWindowConstructorOptions): BrowserWindow;
    getFocusedWindow(): BrowserWindow | null;
  };

  export type BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
  export type Event = Electron.Event;
  export type IpcMainEvent = Electron.IpcMainEvent;
  export type IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

  export const ipcMain: {
    on(channel: string, listener: (event: IpcMainEvent, ...args: any[]) => void): void;
    handle(channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): void;
  };

  export const protocol: {
    registerHttpProtocol(
      scheme: string,
      handler: (request: { url: string; referrer: string; method: string; uploadData?: any[] }, 
               callback: (response: any) => void) => void
    ): void;
  };

  export const app: {
    on(event: string, listener: (...args: any[]) => void): void;
    quit(): void;
    getPath(name: string): string;
    isDefaultProtocolClient(protocol: string): boolean;
    setAsDefaultProtocolClient(protocol: string, execPath?: string, args?: string[]): boolean;
    whenReady(): Promise<void>;
  };
}
