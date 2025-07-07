// This script will ensure the necessary icon files exist in the correct paths
// It copies PNG files directly instead of trying to convert SVGs
const fs = require('fs');
const path = require('path');

console.log('Ensuring icon files exist in the correct locations...');

// Define directories
const BUILD_ICONS_WIN_DIR = path.join(__dirname, 'build', 'icons', 'win');
const BUILD_DIR = path.join(__dirname, 'build');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Make sure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(BUILD_ICONS_WIN_DIR);
ensureDir(BUILD_DIR);

// Use icon.png for all icon files since SVG conversion is failing
const iconPng = path.join(PUBLIC_DIR, 'icon.png');

if (fs.existsSync(iconPng)) {
  console.log(`Using icon.png as the source for all icons: ${iconPng}`);
  
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
  ];
  
  destinations.forEach(dest => {
    try {
      fs.copyFileSync(iconPng, dest.dest);
      console.log(`Created ${dest.name} at ${dest.dest} (copied from icon.png)`);
    } catch (err) {
      console.error(`Error creating ${dest.name}: ${err.message}`);
    }
  });
  
  // Special handling - also copy PNG files for direct use
  try {
    fs.copyFileSync(iconPng, path.join(BUILD_DIR, 'icon.png'));
    console.log(`Created icon.png copy in build directory`);
  } catch (err) {
    console.error(`Error copying PNG to build dir: ${err.message}`);
  }
} else {
  console.error(`ERROR: Source icon not found: ${iconPng}`);
  console.error('Cannot proceed without at least one icon file.');
  process.exit(1);
}

// Create a dummy 'app.ico' file in all relevant locations
// This is specifically to help with Windows taskbar icon issues
const appIcoLocations = [
  path.join(__dirname, 'app.ico'),
  path.join(__dirname, 'node_modules', 'electron', 'dist', 'app.ico')
];

appIcoLocations.forEach(appIcoPath => {
  try {
    const appIcoDir = path.dirname(appIcoPath);
    ensureDir(appIcoDir);
    fs.copyFileSync(iconPng, appIcoPath);
    console.log(`Created app.ico at ${appIcoPath}`);
  } catch (err) {
    console.warn(`Could not create ${appIcoPath}: ${err.message}`);
  }
});

console.log('Icon fix complete!');
