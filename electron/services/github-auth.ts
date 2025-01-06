import { BrowserWindow, app } from 'electron';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

let config: { github: { clientId: string; clientSecret: string } };

try {
  // En développement, utiliser les variables d'environnement
  if (process.env.NODE_ENV === 'development') {
    config = {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
      }
    };
  } else {
    // En production, charger depuis le fichier de configuration injecté
    const configPath = process.env.ELECTRON_IS_DEV 
      ? path.join(__dirname, '../config.js')
      : path.join(process.resourcesPath, 'config.js');
    config = require(configPath);
  }
} catch (error) {
  console.error('Failed to load GitHub configuration:', error);
  config = { github: { clientId: '', clientSecret: '' } };
}

export class GitHubAuthService {
  private static readonly CONFIG_DIR = path.join(app.getPath('userData'), 'auth');
  private static readonly TOKEN_PATH = path.join(GitHubAuthService.CONFIG_DIR, 'github.enc');
  private static readonly ENCRYPTION_KEY = crypto.randomBytes(32);

  static async authorize(): Promise<string> {
    if (!config.github.clientId || !config.github.clientSecret) {
      throw new Error('GitHub OAuth credentials are not configured');
    }

    // Reste du code d'autorisation...
    // Le code existant reste le même, mais utilise config.github.clientId et config.github.clientSecret
  }
}