const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function build() {
  console.log('🚀 Démarrage de la compilation...');

  // Nettoyage
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
  }

  // Build React
  console.log('\n\ud83c���️ Compilation React...');
  execSync('npm run build:react', { stdio: 'inherit' });

  // Build Electron
  console.log('\n🔧 Compilation Electron...');
  execSync('npm run build:electron', { stdio: 'inherit' });

  // Create build directory if it doesn't exist
  if (!fs.existsSync('build')) {
    fs.mkdirSync('build');
  }

  // Electron builder
  console.log('\n📦 Création de l\'installateur...');
  execSync('electron-builder --win --config electron-builder.json', { stdio: 'inherit' });

  console.log('\n✅ Build terminée!');
}

try {
  build();
} catch (error) {
  console.error('\n❌ Erreur de build:', error);
  process.exit(1);
}