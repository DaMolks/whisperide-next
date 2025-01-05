import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';
import { Box, Typography } from '@mui/material';
import { EditorService } from '../../services/editor/EditorService';
import './Editor.css';

interface EditorProps {
  filePath: string | null;
}

const Editor: React.FC<EditorProps> = ({ filePath }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Créer l'éditeur
  useEffect(() => {
    if (!containerRef.current) return;

    editorRef.current = monaco.editor.create(
      containerRef.current,
      EditorService.getEditorOptions()
    );

    // Enregistrer les raccourcis clavier et commandes
    EditorService.registerCommandPallette(editorRef.current);

    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  // Charger un fichier quand le chemin change
  useEffect(() => {
    const loadFile = async () => {
      if (!filePath || !editorRef.current) {
        editorRef.current?.setModel(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Charger le contenu du fichier
        const content = await EditorService.getFileContent(filePath);

        // Créer un nouveau modèle avec le langage approprié
        const language = EditorService.guessLanguage(filePath);
        const model = monaco.editor.createModel(content, language);

        // Définir le modèle dans l'éditeur
        editorRef.current.setModel(model);

        // Si c'est un projet Git, ajouter les décorations de diff
        const isGitInstalled = await window.electron.git.isInstalled();
        if (isGitInstalled) {
          try {
            const diff = await window.electron.git.getDiff(filePath);
            EditorService.registerGitDecorations(editorRef.current, diff);
          } catch (err) {
            // Ignorer les erreurs de diff - ce n'est pas critique
            console.warn('Failed to get git diff:', err);
          }
        }

        // Configurer la sauvegarde automatique
        model.onDidChangeContent(async () => {
          try {
            await EditorService.saveFileContent(filePath, model.getValue());
          } catch (err) {
            if (err instanceof Error) {
              console.error('Failed to auto-save:', err.message);
            } else {
              console.error('Failed to auto-save:', err);
            }
            // Optionnel : afficher une notification d'erreur
          }
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Failed to load file:', err);
        setError(`Erreur lors du chargement du fichier : ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();
  }, [filePath]);

  if (!filePath) {
    return (
      <Box className="editor-container empty-state">
        <Typography variant="body1" sx={{ opacity: 0.7 }}>
          Sélectionnez un fichier pour commencer à éditer
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="editor-container error-state">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="editor-container">
      {isLoading ? (
        <Box className="loading-state">
          <Typography>Chargement...</Typography>
        </Box>
      ) : (
        <div
          ref={containerRef}
          className="monaco-container"
        />
      )}
    </Box>
  );
};

export default Editor;