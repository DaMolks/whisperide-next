import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import * as monaco from 'monaco-editor';

interface IEditor {
  path?: string;
  content?: string;
  language?: string;
}

const Editor: React.FC<IEditor> = ({ 
  path = '', 
  content = '', 
  language = 'typescript' 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Configuration de l'éditeur
      editor.current = monaco.editor.create(editorRef.current, {
        value: content,
        language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: {
          enabled: true,
          scale: 0.75
        },
        fontSize: 14,
        fontFamily: '"Fira Code", monospace',
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        renderLineHighlight: 'all',
        occurrencesHighlight: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: true,
        smoothScrolling: true,
        mouseWheelZoom: true,
        rulers: [],
        wordWrap: 'off',
        folding: true,
        links: true,
        padding: {
          top: 10,
          bottom: 10
        }
      });

      // Événements de l'éditeur
      editor.current.onDidChangeModelContent(() => {
        // TODO: Sauvegarder les modifications
        console.log('Content changed');
      });

      // Configuration des suggestions
      monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: (model, position) => {
          const suggestions: monaco.languages.CompletionItem[] = [
            // Exemples de suggestions (a améliorer avec l'IA)
            {
              label: 'console.log',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'console.log($1)',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Log to console'
            }
          ];

          return { suggestions };
        }
      });
    }

    // Cleanup
    return () => {
      if (editor.current) {
        editor.current.dispose();
      }
    };
  }, [content, language]);

  // Changement de contenu
  useEffect(() => {
    if (editor.current) {
      const currentValue = editor.current.getValue();
      if (currentValue !== content) {
        editor.current.setValue(content);
      }
    }
  }, [content]);

  // Changement de langage
  useEffect(() => {
    if (editor.current) {
      const model = editor.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return (
    <Box
      ref={editorRef}
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#1e1e1e',
        '& .monaco-editor': {
          paddingTop: 1
        }
      }}
    />
  );
};

export default Editor;