const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkDependency(cmd) {
  try {
    execSync(cmd + ' --version');
    return true;
  } catch {
    return false;
  }
}

function installDependencies() {
  console.log('💾 Installation des dépendances...');

  // Node modules
  if (!fs.existsSync('node_modules')) {
    console.log('\n📦 Installation des packages npm...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Global dependencies
  if (!checkDependency('webpack')) {
    console.log('\n🔧 Installation de webpack-cli globalement...');
    execSync('npm install -g webpack-cli', { stdio: 'inherit' });
  }

  console.log('\n✅ Installation terminée!');
}

try {
  installDependencies();
} catch (error) {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
}