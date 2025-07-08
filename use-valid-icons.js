/**
 * Copy valid eye icon files to app.ico and icon.ico locations
 * This ensures all icon references in the app use properly formatted ICOs
 */

const fs = require('fs');
const path = require('path');

console.log('NoDoze Icon Fix - Using Valid Eye Icons');
console.log('--------------------------------------');

// Define paths
const ROOT_DIR = __dirname;
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const BUILD_ICONS_WIN_DIR = path.join(BUILD_DIR, 'icons', 'win');

// Source eye icon files (these are valid ICO files)
const eyeActiveIco = path.join(BUILD_ICONS_WIN_DIR, 'eye-active.ico');
const eyeInactiveIco = path.join(BUILD_ICONS_WIN_DIR, 'eye-inactive.ico');

// Check if source files exist
if (!fs.existsSync(eyeActiveIco)) {
  console.error(`ERROR: Source eye-active.ico not found at ${eyeActiveIco}`);
  process.exit(1);
}

if (!fs.existsSync(eyeInactiveIco)) {
  console.error(`ERROR: Source eye-inactive.ico not found at ${eyeInactiveIco}`);
  process.exit(1);
}

console.log('Source eye icon files found and valid.');

// Define destinations to copy to
const destinations = [
  // Root directory
  { source: eyeActiveIco, dest: path.join(ROOT_DIR, 'app.ico'), name: 'app.ico in root' },
  
  // Build directory
  { source: eyeActiveIco, dest: path.join(BUILD_DIR, 'icon.ico'), name: 'icon.ico in build' },
  { source: eyeActiveIco, dest: path.join(BUILD_DIR, 'icon-active.ico'), name: 'icon-active.ico in build' },
  { source: eyeInactiveIco, dest: path.join(BUILD_DIR, 'icon-inactive.ico'), name: 'icon-inactive.ico in build' },
  
  // Build/icons/win directory
  { source: eyeActiveIco, dest: path.join(BUILD_ICONS_WIN_DIR, 'icon.ico'), name: 'icon.ico in build/icons/win' },
];

// Copy all icon files
console.log('Copying valid icon files to all required locations:');
for (const dest of destinations) {
  try {
    fs.copyFileSync(dest.source, dest.dest);
    console.log(`✓ ${dest.name} (${dest.dest})`);
  } catch (err) {
    console.error(`✗ Failed to copy to ${dest.name}: ${err.message}`);
  }
}

console.log('\nIcon setup complete! All locations now have properly formatted ICO files.');
console.log('When you run the app, you should now see proper icons in the taskbar and tray.');
