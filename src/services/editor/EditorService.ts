import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';

export interface EditorOptions {
  theme?: string;
  fontSize?: number;
  tabSize?: number;
  insertSpaces?: boolean;
  wordWrap?: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
  lineNumbers?: 'on' | 'off' | 'relative';
  minimap?: boolean;
}

export class EditorService {
  private static defaultOptions: EditorOptions = {
    theme: 'vs-dark',
    fontSize: 14,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on',
    lineNumbers: 'on',
    minimap: true
  };

  static getEditorOptions(options?: Partial<EditorOptions>): editor.IStandaloneEditorConstructionOptions {
    const mergedOptions = { ...this.defaultOptions, ...options };

    return {
      theme: mergedOptions.theme,
      fontSize: mergedOptions.fontSize,
      tabSize: mergedOptions.tabSize,
      insertSpaces: mergedOptions.insertSpaces,
      wordWrap: mergedOptions.wordWrap,
      lineNumbers: mergedOptions.lineNumbers,
      minimap: {
        enabled: mergedOptions.minimap
      },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      fixedOverflowWidgets: true,
      folding: true,
      foldingHighlight: true,
      formatOnPaste: true,
      formatOnType: true,
      renderWhitespace: 'boundary',
      scrollbar: {
        useShadows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10
      }
    };
  }

  static guessLanguage(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (!ext) return 'plaintext';

    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'json': 'json',
      'html': 'html',
      'xml': 'xml',
      'css': 'css',
      'scss': 'scss',
      'sass': 'scss',
      'less': 'less',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'h': 'cpp',
      'hpp': 'cpp',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'php': 'php',
      'swift': 'swift',
      'kt': 'kotlin',
      'kts': 'kotlin',
      'md': 'markdown',
      'sql': 'sql',
      'sh': 'shell',
      'bash': 'shell',
      'yaml': 'yaml',
      'yml': 'yaml',
      'dockerfile': 'dockerfile',
      'vue': 'html',
      'svelte': 'html',
    };

    return languageMap[ext] || 'plaintext';
  }

  static async getFileContent(path: string): Promise<string> {
    try {
      return await window.electron.files.read(path);
    } catch (error) {
      console.error('Failed to read file:', error);
      throw error;
    }
  }

  static async saveFileContent(path: string, content: string): Promise<void> {
    try {
      await window.electron.files.write(path, content);
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  }

  static registerCommandPallette(editor: editor.IStandaloneCodeEditor) {
    // Ajouter des commandes personnalisées au palette de commandes
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const model = editor.getModel();
      if (model) {
        const content = model.getValue();
        // TODO: Sauvegarder le fichier
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
      // TODO: Ouvrir la palette de commandes
    });
  }

  static registerGitDecorations(editor: editor.IStandaloneCodeEditor, gitDiff?: string) {
    if (!gitDiff) return;

    const model = editor.getModel();
    if (!model) return;

    // Parse le diff Git et crée les décorations
    const decorations = this.parseGitDiff(gitDiff);
    
    editor.createDecorationsCollection(decorations);
  }

  private static parseGitDiff(diff: string): editor.IModelDeltaDecoration[] {
    const decorations: editor.IModelDeltaDecoration[] = [];
    const lines = diff.split('\n');
    let currentLine = 0;

    for (const line of lines) {
      if (line.startsWith('+')) {
        decorations.push({
          range: new monaco.Range(currentLine, 1, currentLine, 1),
          options: {
            isWholeLine: true,
            linesDecorationsClassName: 'git-addition-gutter',
            className: 'git-addition-line'
          }
        });
      } else if (line.startsWith('-')) {
        decorations.push({
          range: new monaco.Range(currentLine, 1, currentLine, 1),
          options: {
            isWholeLine: true,
            linesDecorationsClassName: 'git-deletion-gutter',
            className: 'git-deletion-line'
          }
        });
      }
      currentLine++;
    }

    return decorations;
  }
}