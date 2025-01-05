const { app, BrowserWindow } = require('electron');
import { initialize, enable } = require('@electron/remote/main');
import type { Event } from 'electron';

// Initialiser electron/remote
initialize();

app.whenReady().then(() => {
  app.on('browser-window-created', (_: Event, window: typeof BrowserWindow) => {
    enable(window);
  });
});

require('./main');