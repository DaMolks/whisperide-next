const fs = require('fs');
const path = require('path');

// Cette fonction sera appelée après la compilation
function injectKeys() {
  const configPath = path.join(__dirname, '../dist/electron/config.js');
  
  const configContent = `
    module.exports = {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '${process.env.GITHUB_CLIENT_ID || ''}',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '${process.env.GITHUB_CLIENT_SECRET || ''}'
      }
    };
  `;

  fs.writeFileSync(configPath, configContent);
  console.log('OAuth keys injected successfully');
}

if (require.main === module) {
  injectKeys();
}
