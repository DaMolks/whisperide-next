const { app, BrowserWindow } = require('electron');
const { initialize, enable } = require('@electron/remote/main');

// Initialiser electron/remote
initialize();

app.whenReady().then(() => {
  // Configure les fenêtres pour utiliser remote
  app.on('browser-window-created', (_, window) => {
    enable(window);
  });
});

// Le reste de la configuration Electron reste inchangé
require('./main');