import * as fs from 'fs/promises';
import * as path from 'path';
import type { FileEntry } from '@shared/types';

export class FileService {
  static async list(dirPath: string): Promise<FileEntry[]> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      return entries.map(entry => ({
        path: path.join(dirPath, entry.name),
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file'
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  static async read(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }

  static async write(filePath: string, content: string): Promise<void> {
    try {
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }
  }

  static async createFile(filePath: string): Promise<void> {
    try {
      await fs.writeFile(filePath, '', 'utf-8');
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  static async createDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
      throw error;
    }
  }

  static async rename(oldPath: string, newPath: string): Promise<void> {
    try {
      await fs.rename(oldPath, newPath);
    } catch (error) {
      console.error('Error renaming file:', error);
      throw error;
    }
  }

  static async delete(filePath: string): Promise<void> {
    try {
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        await fs.rm(filePath, { recursive: true });
      } else {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}