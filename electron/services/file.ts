import { promises as fs } from 'fs';
import * as path from 'path';
import type { FileEntry } from '@shared/types';

export class FileService {
  static async list(dirPath: string): Promise<FileEntry[]> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const fileEntries: FileEntry[] = [];

      for (const entry of entries) {
        if (entry.name.startsWith('.') && entry.name !== '.gitignore') {
          continue;
        }

        fileEntries.push({
          name: entry.name,
          path: path.join(dirPath, entry.name),
          type: entry.isDirectory() ? 'directory' : 'file'
        });
      }

      return fileEntries.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'directory' ? -1 : 1;
      });
    } catch (error) {
      console.error(`Error listing directory ${dirPath}:`, error);
      throw error;
    }
  }

  static async read(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      throw error;
    }
  }

  static async write(filePath: string, content: string): Promise<void> {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      console.error(`Error writing file ${filePath}:`, error);
      throw error;
    }
  }

  static async createFile(filePath: string): Promise<void> {
    try {
      const exists = await this.exists(filePath);
      if (exists) {
        throw new Error('File already exists');
      }

      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, '', 'utf-8');
    } catch (error) {
      console.error(`Error creating file ${filePath}:`, error);
      throw error;
    }
  }

  static async createDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${dirPath}:`, error);
      throw error;
    }
  }

  static async rename(oldPath: string, newPath: string): Promise<void> {
    try {
      const exists = await this.exists(newPath);
      if (exists) {
        throw new Error('Destination already exists');
      }

      const dir = path.dirname(newPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.rename(oldPath, newPath);
    } catch (error) {
      console.error(`Error renaming ${oldPath} to ${newPath}:`, error);
      throw error;
    }
  }

  static async delete(filePath: string): Promise<void> {
    try {
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        await fs.rm(filePath, { recursive: true, force: true });
      } else {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error(`Error deleting ${filePath}:`, error);
      throw error;
    }
  }

  private static async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}