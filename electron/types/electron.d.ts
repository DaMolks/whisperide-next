declare module 'electron' {
  export interface Event {
    preventDefault(): void;
    sender: any;
  }

  export interface IpcMainEvent extends Event {
    reply: (channel: string, ...args: any[]) => void;
  }

  export interface IpcMainInvokeEvent extends IpcMainEvent {}

  export interface BrowserWindowConstructorOptions {
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

  export interface WebContents {
    send(channel: string, ...args: any[]): void;
  }

  export interface BrowserWindow {
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

  export const BrowserWindow: {
    new(options: BrowserWindowConstructorOptions): BrowserWindow;
    getFocusedWindow(): BrowserWindow | null;
  };

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

  export const protocol: {
    registerHttpProtocol(
      scheme: string,
      handler: (request: { url: string; referrer: string; method: string; uploadData?: any[] }, 
               callback: (response: any) => void) => void
    ): void;
  };
}
