const fs = require('fs');
const path = require('path');

// Créer le dossier dist si nécessaire
const distPath = path.join(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

// Créer le dossier dist/electron si nécessaire
const electronDistPath = path.join(distPath, 'electron');
if (!fs.existsSync(electronDistPath)) {
  fs.mkdirSync(electronDistPath);
}

console.log('Installation setup completed successfully!');
