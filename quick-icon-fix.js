/**
 * Simplified but effective icon fix for NoDoze
 * Simply copies icon.png to all required locations to ensure they exist
 */

const fs = require('fs');
const path = require('path');

console.log('NoDoze Quick Icon Fix');
console.log('--------------------');

// Define paths
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const BUILD_ICONS_WIN_DIR = path.join(BUILD_DIR, 'icons', 'win');

// Make sure directories exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDirExists(BUILD_ICONS_WIN_DIR);

// Source icon
const iconPng = path.join(PUBLIC_DIR, 'icon.png');

if (fs.existsSync(iconPng)) {
  console.log(`Using source icon: ${iconPng}`);
  
  // Define all destination paths
  const destinations = [
    { dest: path.join(ROOT_DIR, 'app.ico'), name: 'app.ico in root (critical for Windows)' },
    { dest: path.join(BUILD_DIR, 'icon.ico'), name: 'icon.ico in build' },
    { dest: path.join(BUILD_DIR, 'icon.png'), name: 'icon.png in build' },
    { dest: path.join(BUILD_DIR, 'icon-active.ico'), name: 'icon-active.ico in build' },
    { dest: path.join(BUILD_DIR, 'icon-inactive.ico'), name: 'icon-inactive.ico in build' },
    { dest: path.join(BUILD_ICONS_WIN_DIR, 'icon.ico'), name: 'icon.ico in build/icons/win' },
    { dest: path.join(BUILD_ICONS_WIN_DIR, 'icon-active.ico'), name: 'icon-active.ico in build/icons/win' },
    { dest: path.join(BUILD_ICONS_WIN_DIR, 'icon-inactive.ico'), name: 'icon-inactive.ico in build/icons/win' }
  ];
  
  // Copy to all destinations
  for (const dest of destinations) {
    try {
      fs.copyFileSync(iconPng, dest.dest);
      console.log(`✓ Created ${dest.name}`);
    } catch (err) {
      console.error(`✗ Failed to create ${dest.name}: ${err.message}`);
    }
  }
  
  console.log('\nICON SETUP COMPLETE!');
  console.log('===================');
  console.log('Note: Since we cannot properly convert PNG to ICO without external tools,');
  console.log('the ICO files are actually renamed PNG files. This works in most cases,');
  console.log('but for the best results, you should use real ICO files with multiple sizes.');
  console.log('\nNext steps:');
  console.log('1. Start the app with: npm start');
  console.log('2. If icons still don\'t appear, try running: node check-icon-paths.js');
  
} else {
  console.error(`ERROR: Source icon not found: ${iconPng}`);
  console.error('Cannot proceed with icon fix.');
}
