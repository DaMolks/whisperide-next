const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function build() {
  console.log('🚀 Démarrage de la compilation...');

  // Nettoyage
  console.log('\n🧹 Nettoyage des dossiers de build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
  }

  // Build React
  console.log('\n🏗️  Compilation React...');
  execSync('npm run build:react', { stdio: 'inherit' });

  // Build Electron
  console.log('\n🔧 Compilation Electron...');
  execSync('npm run build:electron', { stdio: 'inherit' });

  // Packaging
  console.log('\n📦 Packaging de l\'application...');
  execSync('electron-builder build --win', { stdio: 'inherit' });

  console.log('\n✅ Build terminée!');
}

try {
  build();
} catch (error) {
  console.error('\n❌ Erreur de build:', error);
  process.exit(1);
}