import * as fs from 'fs/promises';
import * as path from 'path';

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileEntry[];
  gitStatus?: 'modified' | 'untracked' | 'staged' | null;
}

export class FileSystemService {
  // Liste récursivement les fichiers et dossiers
  static async listFiles(dirPath: string, gitStatus?: Map<string, string>): Promise<FileEntry[]> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const result: FileEntry[] = [];

    for (const entry of entries) {
      // Ignorer les fichiers et dossiers cachés et le dossier .git
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(process.cwd(), fullPath);
      
      if (entry.isDirectory()) {
        const children = await this.listFiles(fullPath, gitStatus);
        result.push({
          name: entry.name,
          path: fullPath,
          type: 'directory',
          children
        });
      } else {
        result.push({
          name: entry.name,
          path: fullPath,
          type: 'file',
          gitStatus: gitStatus?.get(relativePath) || null
        });
      }
    }

    // Trier : dossiers d'abord, puis fichiers, par ordre alphabétique
    return result.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });
  }

  // Lire le contenu d'un fichier
  static async readFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  }

  // Écrire dans un fichier
  static async writeFile(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  }

  // Créer un nouveau fichier
  static async createFile(filePath: string): Promise<void> {
    await this.writeFile(filePath, '');
  }

  // Créer un nouveau dossier
  static async createDirectory(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  // Renommer un fichier ou dossier
  static async rename(oldPath: string, newPath: string): Promise<void> {
    await fs.rename(oldPath, newPath);
  }

  // Supprimer un fichier ou dossier
  static async delete(path: string): Promise<void> {
    const stat = await fs.stat(path);
    if (stat.isDirectory()) {
      await fs.rm(path, { recursive: true });
    } else {
      await fs.unlink(path);
    }
  }
}