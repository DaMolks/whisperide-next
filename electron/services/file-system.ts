import * as fs from 'fs/promises';
import * as path from 'path';
import type { FileEntry } from '@shared/types';
import { GitService } from './git';

export class FileSystemService {
  static async listFiles(dirPath: string): Promise<FileEntry[]> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const gitStatus = await this.getGitStatus(dirPath);

    const filePromises = entries.map(async entry => {
      const entryPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(dirPath, entryPath);

      if (entry.isDirectory()) {
        // Récursivement lister les fichiers des sous-dossiers
        const children = await this.listFiles(entryPath);
        return {
          name: entry.name,
          path: entryPath,
          type: 'directory' as const,
          children
        };
      } else {
        // Fichier simple
        const status = gitStatus?.get(relativePath);
        return {
          name: entry.name,
          path: entryPath,
          type: 'file' as const,
          gitStatus: status as ('modified' | 'untracked' | 'staged') | null
        };
      }
    });

    return Promise.all(filePromises);
  }

  private static async getGitStatus(dirPath: string): Promise<Map<string, string> | null> {
    try {
      const gitInfo = await GitService.getGitInfo(dirPath);
      if (!gitInfo.isGitRepo) return null;

      const status = await GitService.getStatus(dirPath);
      const statusMap = new Map<string, string>();

      // Fichiers staged
      for (const file of status.staged) {
        statusMap.set(file, 'staged');
      }

      // Fichiers modifiés
      for (const file of status.modified) {
        if (!statusMap.has(file)) {
          statusMap.set(file, 'modified');
        }
      }

      // Fichiers non suivis
      for (const file of status.untracked) {
        statusMap.set(file, 'untracked');
      }

      return statusMap;
    } catch {
      return null;
    }
  }

  static async createFile(filePath: string): Promise<void> {
    await fs.writeFile(filePath, '');
  }

  static async readFile(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  }

  static async writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content, 'utf-8');
  }

  static async delete(filePath: string): Promise<void> {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      await fs.rm(filePath, { recursive: true });
    } else {
      await fs.unlink(filePath);
    }
  }

  static async rename(oldPath: string, newPath: string): Promise<void> {
    await fs.rename(oldPath, newPath);
  }

  static async createDirectory(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }
}