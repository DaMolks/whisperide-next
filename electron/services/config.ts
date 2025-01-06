import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import defaultConfig from '@shared/config/default.json';

export class ConfigService {
  private static readonly CONFIG_PATH = path.join(app.getPath('userData'), 'config.json');

  static async getConfig<T = any>(key?: string): Promise<T> {
    try {
      const config = await this.loadConfig();
      return key ? this.get(config, key) : config;
    } catch (error) {
      console.error('Error loading config:', error);
      return key ? this.get(defaultConfig, key) : defaultConfig;
    }
  }

  static async setConfig(key: string, value: any): Promise<void> {
    try {
      const config = await this.loadConfig();
      this.set(config, key, value);
      await this.saveConfig(config);
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  }

  private static async loadConfig(): Promise<any> {
    try {
      const content = await fs.readFile(this.CONFIG_PATH, 'utf-8');
      return JSON.parse(content);
    } catch {
      // Si le fichier n'existe pas, retourner la config par défaut
      await this.saveConfig(defaultConfig);
      return defaultConfig;
    }
  }

  private static async saveConfig(config: any): Promise<void> {
    await fs.writeFile(this.CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  }

  private static get(obj: any, path: string): any {
    return path.split('.').reduce((o, i) => o?.[i], obj);
  }

  private static set(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    const last = parts.pop()!;
    const target = parts.reduce((o, i) => {
      if (!(i in o)) o[i] = {};
      return o[i];
    }, obj);
    target[last] = value;
  }
}