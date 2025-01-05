declare namespace Electron {
  interface ProtocolRequest {
    url: string;
    referrer: string;
    method: string;
    uploadData?: UploadData[];
  }

  interface ProtocolResponse {
    error?: number;
    statusCode?: number;
    data?: Buffer | string | ReadableStream;
    headers?: Record<string, string | string[]>;
    mimeType?: string;
    charset?: string;
  }

  interface IpcMainEvent {
    reply: (channel: string, ...args: any[]) => void;
    frameId: number;
    processId: number;
    returnValue: any;
  }

  interface IpcMainInvokeEvent extends IpcMainEvent {
    sender: any;
  }
}