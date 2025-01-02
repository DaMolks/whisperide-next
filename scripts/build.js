const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  appName: 'WhisperIDE',
  version: '0.1.0',
  outputDir: 'dist'
};

function build() {
  console.log('🚀 Starting build process...');

  // Clean output directory
  console.log('\n🧹 Cleaning output directory...');
  if (fs.existsSync(CONFIG.outputDir)) {
    fs.rmSync(CONFIG.outputDir, { recursive: true });
  }
  fs.mkdirSync(CONFIG.outputDir);

  // Build React app
  console.log('\n🏗️  Building React application...');
  execSync('npm run build:react', { stdio: 'inherit' });

  // Build Electron main process
  console.log('\n🔧 Building Electron main process...');
  execSync('npm run build:electron', { stdio: 'inherit' });

  // Package application
  console.log('\n📦 Packaging application...');
  execSync('electron-builder', { stdio: 'inherit' });

  console.log('\n✅ Build complete!');
}

try {
  build();
} catch (error) {
  console.error('\n❌ Build failed:', error);
  process.exit(1);
}