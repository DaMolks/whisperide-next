import { app } from 'electron';
import { AppService } from './services/app';
import 'dotenv/config';

class WhisperIDEApp {
  private appService: AppService | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // S'assurer qu'une seule instance est en cours d'exécution
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
      return;
    }

    // Gérer la seconde instance
    app.on('second-instance', () => {
      if (this.appService) {
        this.appService.focusMainWindow();
      }
    });

    // Initialiser l'application quand elle est prête
    app.whenReady().then(async () => {
      // Créer et initialiser le service principal
      this.appService = new AppService();
      await this.appService.initialize();
    });

    // Gérer la fermeture de l'application
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', async () => {
      if (!this.appService) {
        this.appService = new AppService();
        await this.appService.initialize();
      } else {
        this.appService.createMainWindow();
      }
    });
  }
}

new WhisperIDEApp();