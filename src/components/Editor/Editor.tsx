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

        // Vérification Git et gestion des décorations
        try {
          const diff = await window.electron.git.getDiff(filePath);
          if (diff) {
            EditorService.registerGitDecorations(editorRef.current, diff);
          }
        } catch (error) {
          // Ne pas afficher d'erreur si Git n'est pas installé ou si le fichier n'est pas dans un repo
          console.debug('Git diff not available:', 
            error instanceof Error ? error.message : 'Unknown error');
        }

        // Configurer la sauvegarde automatique
        model.onDidChangeContent(async () => {
          try {
            await EditorService.saveFileContent(filePath, model.getValue());
          } catch (error) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to save file';
            console.error('Auto-save failed:', errorMessage);
            // TODO: Afficher une notification d'erreur à l'utilisateur
          }
        });
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Unknown error';
        console.error('Failed to load file:', error);
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