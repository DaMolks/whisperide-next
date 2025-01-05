export declare namespace Electron {
  export interface Event {
    preventDefault(): void;
    sender: any;
  }

  export interface IpcMainEvent extends Event {
    reply: (channel: string, ...args: any[]) => void;
  }

  export interface IpcMainInvokeEvent extends IpcMainEvent {}

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
}

export interface BrowserWindow extends Electron.BrowserWindow {}

export type Event = Electron.Event;
export type IpcMainEvent = Electron.IpcMainEvent;
export type IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
