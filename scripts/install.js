const fs = require('fs');
const path = require('path');

// Créer la structure des dossiers nécessaires
const directories = [
  'dist',
  'dist/electron',
  'shared/types',
  '.whisperide'
];

// Créer les dossiers s'ils n'existent pas
directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Créer un fichier .env par défaut s'il n'existe pas
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# Configuration WhisperIDE

# Environment (development/production)
NODE_ENV=development

# GitHub OAuth App credentials
# GITHUB_CLIENT_ID=your_client_id_here
# GITHUB_CLIENT_SECRET=your_client_secret_here

# Development server port
PORT=8080

# Logging level (debug/info/warn/error)
LOG_LEVEL=info`;

  fs.writeFileSync(envPath, envContent);
  console.log('Created default .env file');
}

// Créer une configuration WhisperIDE par défaut
const configPath = path.join(__dirname, '..', '.whisperide', 'config.json');
if (!fs.existsSync(configPath)) {
  const configContent = {
    theme: 'dark',
    recentProjects: [],
    gitPath: 'git',
    preferences: {
      editor: {
        fontSize: 14,
        fontFamily: 'Fira Code, monospace',
        tabSize: 2,
        insertSpaces: true,
        wordWrap: 'on'
      },
      terminal: {
        fontSize: 14,
        fontFamily: 'Consolas, monospace',
        shell: process.platform === 'win32' ? 'powershell.exe' : 'bash'
      }
    }
  };

  fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2));
  console.log('Created default WhisperIDE configuration');
}

console.log('Installation setup completed!');
