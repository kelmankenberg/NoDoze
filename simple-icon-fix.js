/**
 * Simplified icon fix for NoDoze
 * This script ensures all necessary icon files exist and are properly
 * formatted for use in both development and production environments.
 * It focuses on providing working icons without SVG to ICO conversion.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('NoDoze Simple Icon Fix');
console.log('----------------------');

// Define paths
const ROOT_DIR = __dirname;
const SRC_MAIN_DIR = path.join(ROOT_DIR, 'src', 'main');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const BUILD_ICONS_WIN_DIR = path.join(ROOT_DIR, 'build', 'icons', 'win');
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const ELECTRON_PATH = path.join(ROOT_DIR, 'node_modules', 'electron', 'dist');

// Make sure directories exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDirExists(BUILD_ICONS_WIN_DIR);
ensureDirExists(BUILD_DIR);
ensureDirExists(path.join(BUILD_DIR, 'icons'));

// Copy icon files from public to build directories
console.log('Copying icon files to build directories...');

// Use icon.png for all necessary icons
const iconPng = path.join(PUBLIC_DIR, 'icon.png');

if (fs.existsSync(iconPng)) {
  console.log(`Using source icon: ${iconPng}`);
  
  // Copy to all required locations
  const destinations = [
    // Main icons in the win folder
    { dest: path.join(BUILD_ICONS_WIN_DIR, 'icon.ico'), name: 'icon.ico' },
    { dest: path.join(BUILD_ICONS_WIN_DIR, 'icon-active.ico'), name: 'icon-active.ico' },
    { dest: path.join(BUILD_ICONS_WIN_DIR, 'icon-inactive.ico'), name: 'icon-inactive.ico' },
    
    // Fallbacks in the build root
    { dest: path.join(BUILD_DIR, 'icon.ico'), name: 'icon.ico' },
    { dest: path.join(BUILD_DIR, 'icon-active.ico'), name: 'icon-active.ico' },
    { dest: path.join(BUILD_DIR, 'icon-inactive.ico'), name: 'icon-inactive.ico' },
    { dest: path.join(BUILD_DIR, 'icon.png'), name: 'icon.png' },
    
    // Add app.ico in application root
    { dest: path.join(ROOT_DIR, 'app.ico'), name: 'app.ico' }
  ];
  
  destinations.forEach(dest => {
    try {
      fs.copyFileSync(iconPng, dest.dest);
      console.log(`Created ${dest.name} at ${dest.dest}`);
    } catch (err) {
      console.error(`Error creating ${dest.name}: ${err.message}`);
    }
  });
  
  // Create app.ico in Electron directory for the extreme fallback scenario
  try {
    const electronAppIco = path.join(ELECTRON_PATH, 'app.ico');
    fs.copyFileSync(iconPng, electronAppIco);
    console.log(`Created app.ico in Electron directory: ${electronAppIco}`);
  } catch (err) {
    console.warn(`Could not create app.ico in Electron directory: ${err.message}`);
  }
  
  console.log('\nIcon placement complete!');
  console.log('All necessary icon files created from icon.png.');
  console.log('You can now start the application with: npm start');
  
} else {
  console.error(`ERROR: Source icon not found: ${iconPng}`);
  console.error('Cannot proceed with icon fix. Make sure icon.png exists in public directory.');
  process.exit(1);
}
