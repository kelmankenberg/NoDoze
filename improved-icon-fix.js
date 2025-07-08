/**
 * Improved icon fix for NoDoze
 * This script properly converts PNG to ICO format for Windows
 * and ensures all necessary icon files exist in the right locations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('NoDoze Improved Icon Fix');
console.log('------------------------');

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

// Check if we have the PNG to ICO converter installed
try {
  // First try to install the required packages if they don't exist
  console.log('Checking for required packages...');
  
  try {
    execSync('npm list -g png-to-ico', { stdio: 'ignore' });
    console.log('png-to-ico is already installed.');
  } catch (e) {
    console.log('Installing png-to-ico package...');
    execSync('npm install -g png-to-ico', { stdio: 'inherit' });
  }
  
  // Source icons - we'll use the main icon.png for all versions
  const iconPng = path.join(PUBLIC_DIR, 'icon.png');
  const iconActiveTempPath = path.join(BUILD_DIR, 'temp-icon-active.png');
  const iconInactiveTempPath = path.join(BUILD_DIR, 'temp-icon-inactive.png');
  
  // Create temporary copies of the main icon for active/inactive states
  if (fs.existsSync(iconPng)) {
    console.log('Creating temporary PNG files for icon states');
    fs.copyFileSync(iconPng, iconActiveTempPath);
    fs.copyFileSync(iconPng, iconInactiveTempPath);
  }
  
  // Convert PNG to ICO files
  const convertToIco = (pngPath, icoPath) => {
    if (fs.existsSync(pngPath)) {
      console.log(`Converting ${pngPath} to ICO...`);
      execSync(`png-to-ico ${pngPath} > ${icoPath}`, { stdio: 'inherit' });
      console.log(`Created ${icoPath}`);
      return true;
    } else {
      console.error(`Source PNG not found: ${pngPath}`);
      return false;
    }
  };
  
  // Create all required ICO files
  convertToIco(iconPng, path.join(BUILD_ICONS_WIN_DIR, 'icon.ico'));
  convertToIco(iconActiveTempPath, path.join(BUILD_ICONS_WIN_DIR, 'icon-active.ico'));
  convertToIco(iconInactiveTempPath, path.join(BUILD_ICONS_WIN_DIR, 'icon-inactive.ico'));
  
  // Also create copies in the build root
  convertToIco(iconPng, path.join(BUILD_DIR, 'icon.ico'));
  convertToIco(iconActiveTempPath, path.join(BUILD_DIR, 'icon-active.ico'));
  convertToIco(iconInactiveTempPath, path.join(BUILD_DIR, 'icon-inactive.ico'));
  
  // Clean up temporary files
  try {
    if (fs.existsSync(iconActiveTempPath)) fs.unlinkSync(iconActiveTempPath);
    if (fs.existsSync(iconInactiveTempPath)) fs.unlinkSync(iconInactiveTempPath);
  } catch (e) {
    console.warn('Could not clean up temporary files:', e);
  }
  
  // Create app.ico in root directory for Windows taskbar
  convertToIco(iconPng, path.join(ROOT_DIR, 'app.ico'));
  
  // Copy PNG files as well
  console.log('Copying PNG files to build directory...');
  fs.copyFileSync(iconPng, path.join(BUILD_DIR, 'icon.png'));
  
  console.log('\nIcon conversion complete!');
  console.log('All necessary icon files have been created and converted to proper formats.');
  
} catch (error) {
  console.error('Error during icon conversion:', error);
  console.error('\nFalling back to simple copy method...');
  
  // Fallback to simple copy if conversion fails
  const iconPng = path.join(PUBLIC_DIR, 'icon.png');
  
  if (fs.existsSync(iconPng)) {
    const destinations = [
      { dest: path.join(BUILD_ICONS_WIN_DIR, 'icon.ico'), name: 'icon.ico' },
      { dest: path.join(BUILD_ICONS_WIN_DIR, 'icon-active.ico'), name: 'icon-active.ico' },
      { dest: path.join(BUILD_ICONS_WIN_DIR, 'icon-inactive.ico'), name: 'icon-inactive.ico' },
      { dest: path.join(BUILD_DIR, 'icon.ico'), name: 'icon.ico' },
      { dest: path.join(BUILD_DIR, 'icon-active.ico'), name: 'icon-active.ico' },
      { dest: path.join(BUILD_DIR, 'icon-inactive.ico'), name: 'icon-inactive.ico' },
      { dest: path.join(BUILD_DIR, 'icon.png'), name: 'icon.png' },
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
  } else {
    console.error(`ERROR: Source icon not found: ${iconPng}`);
    process.exit(1);
  }
}
