const { ipcMain, dialog } = require('electron');
import type { IpcMainInvokeEvent } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ProjectService } from './services/project';
import type { ProjectConfig, ProjectInfo } from '@shared/types';

interface FileDialogResult {
  canceled: boolean;
  filePaths: string[];
}

export function setupProjectHandlers() {
  // Liste les projets récents
  ipcMain.handle('get-recent-projects', async (_: IpcMainInvokeEvent) => {
    return ProjectService.getRecentProjects();
  });

  // Sélection d'un dossier
  ipcMain.handle('select-directory', async (_: IpcMainInvokeEvent): Promise<string | null> => {
    const result: FileDialogResult = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    });

    return result.canceled ? null : result.filePaths[0];
  });

  // Création d'un nouveau projet
  ipcMain.handle(
    'create-project',
    async (_: IpcMainInvokeEvent, projectPath: string, config?: ProjectConfig): Promise<ProjectInfo> => {
      return ProjectService.createProject(projectPath, config);
    }
  );

  // Ouverture d'un projet existant
  ipcMain.handle(
    'open-project',
    async (_: IpcMainInvokeEvent, projectPath: string): Promise<ProjectInfo> => {
      return ProjectService.openProject(projectPath);
    }
  );

  // Gestion des fichiers
  ipcMain.handle('list-files', async (_: IpcMainInvokeEvent, dirPath: string) => {
    return ProjectService.listFiles(dirPath);
  });

  ipcMain.handle('read-file', async (_: IpcMainInvokeEvent, filePath: string) => {
    return fs.readFile(filePath, 'utf-8');
  });

  ipcMain.handle(
    'write-file', 
    async (_: IpcMainInvokeEvent, filePath: string, content: string) => {
      return fs.writeFile(filePath, content, 'utf-8');
    }
  );

  ipcMain.handle('create-file', async (_: IpcMainInvokeEvent, filePath: string) => {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    return fs.writeFile(filePath, '', 'utf-8');
  });

  ipcMain.handle('create-directory', async (_: IpcMainInvokeEvent, dirPath: string) => {
    return fs.mkdir(dirPath, { recursive: true });
  });

  ipcMain.handle(
    'rename-file',
    async (_: IpcMainInvokeEvent, oldPath: string, newPath: string) => {
      return fs.rename(oldPath, newPath);
    }
  );

  ipcMain.handle('delete-file', async (_: IpcMainInvokeEvent, filePath: string) => {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      return fs.rm(filePath, { recursive: true });
    } else {
      return fs.unlink(filePath);
    }
  });
}