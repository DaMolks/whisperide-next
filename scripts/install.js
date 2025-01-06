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

# GitHub OAuth App credentials
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here

# Encryption key for tokens
ENCRYPTION_KEY=replace_with_secure_key_in_production
`;

  fs.writeFileSync(envPath, envContent);
  console.log('Created default .env file');
}

console.log('Installation setup completed!');
