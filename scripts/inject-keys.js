const fs = require('fs');
const path = require('path');

// Cette fonction sera appelée après la compilation
function injectKeys() {
  const configPath = path.join(__dirname, '../dist/electron/config.js');
  
  // Vérifier que les variables d'environnement sont présentes
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.error('GitHub OAuth credentials are not set in environment');
    process.exit(1);
  }

  const configContent = `
    module.exports = {
      github: {
        clientId: '${process.env.GITHUB_CLIENT_ID}',
        clientSecret: '${process.env.GITHUB_CLIENT_SECRET}'
      }
    };
  `;

  // Créer le dossier si nécessaire
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Écrire le fichier de configuration
  fs.writeFileSync(configPath, configContent);
  console.log('OAuth keys injected successfully');
}

if (require.main === module) {
  injectKeys();
}
