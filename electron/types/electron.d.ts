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
}

declare module 'electron' {
  export type IpcMainEvent = Electron.IpcMainEvent;
  export type IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
  export type Event = Electron.Event;
  export type BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;

  export const app: {
    on(event: string, listener: (...args: any[]) => void): void;
    quit(): void;
    getPath(name: string): string;
    isDefaultProtocolClient(protocol: string): boolean;
    setAsDefaultProtocolClient(protocol: string, execPath?: string, args?: string[]): boolean;
    whenReady(): Promise<void>;
  };

  export const BrowserWindow: {
    new(options: Electron.BrowserWindowConstructorOptions): typeof BrowserWindow;
    getFocusedWindow(): typeof BrowserWindow | null;
  };
}