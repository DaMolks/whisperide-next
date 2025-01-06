/// <reference types="electron" />

declare namespace Electron {
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

  interface App {
    requestSingleInstanceLock(): boolean;
    setAsDefaultProtocolClient(protocol: string, execPath?: string): boolean;
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
}

declare module 'electron' {
  export * from 'electron';
}