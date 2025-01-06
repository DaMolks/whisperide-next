import { BrowserWindow, IpcMainInvokeEvent, WebContents } from 'electron';

declare global {
  namespace Electron {
    interface Event {
      preventDefault: () => void;
      sender: WebContents;
    }

    interface IpcMainEvent extends Event {
      reply: (channel: string, ...args: any[]) => void;
    }

    interface WebRequest {
      onBeforeRequest: (filter: any, listener: (details: any) => void) => void;
    }
  }
}