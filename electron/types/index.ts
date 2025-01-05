export interface IpcMainEvent {
  reply: (channel: string, ...args: any[]) => void;
  sender: any;
}

export interface IpcMainInvokeEvent extends IpcMainEvent {
  sender: any;
}

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

export type Process = NodeJS.Process & {
  defaultApp?: boolean;
};

export type WindowOptions = BrowserWindowConstructorOptions;