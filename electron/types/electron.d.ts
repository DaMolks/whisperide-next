declare namespace Electron {
  interface WebContents {
    send(channel: string, ...args: any[]): void;
    on(event: string, listener: Function): void;
    openDevTools(): void;
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

  class BrowserWindow {
    constructor(options?: BrowserWindowConstructorOptions);
    webContents: WebContents;
    loadURL(url: string): Promise<void>;
    loadFile(filePath: string): Promise<void>;
    show(): void;
    close(): void;
    minimize(): void;
    maximize(): void;
    unmaximize(): void;
    restore(): void;
    focus(): void;
    isMaximized(): boolean;
    on(event: string, listener: Function): void;
  }

  interface App {
    getPath(name: string): string;
    requestSingleInstanceLock(): boolean;
    on(event: string, listener: Function): void;
    quit(): void;
    whenReady(): Promise<void>;
  }
}

declare module 'electron' {
  export const app: Electron.App;
  export const BrowserWindow: typeof Electron.BrowserWindow;
  export const WebContents: typeof Electron.WebContents;
  export type BrowserWindow = Electron.BrowserWindow;
  export type WebContents = Electron.WebContents;
}