// This script will check that the necessary icon files exist with the correct paths
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('Checking and fixing icon paths...');

// Define expected icon locations for development
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

// Check for icon files in the correct locations
const requiredIcons = [
  { src: path.join(PUBLIC_DIR, 'icon.png'), dest: path.join(BUILD_ICONS_WIN_DIR, 'icon.ico') },
  { src: path.join(PUBLIC_DIR, 'eye-active.svg'), dest: path.join(BUILD_ICONS_WIN_DIR, 'icon-active.ico') },
  { src: path.join(PUBLIC_DIR, 'eye-inactive.svg'), dest: path.join(BUILD_ICONS_WIN_DIR, 'icon-inactive.ico') },
];

// Copy icon files from public to build/icons/win and convert to ICO
for (const iconFile of requiredIcons) {
  if (fs.existsSync(iconFile.src)) {
    console.log(`Found source icon: ${iconFile.src}`);
    
    try {
      // Use svg-to-ico package if it's an SVG
      if (iconFile.src.endsWith('.svg')) {
        const svgToIco = require('svg-to-ico');
        console.log(`Converting ${iconFile.src} to ${iconFile.dest}`);
        
        // First convert SVG to PNG (required sizes for ICO)
        svgToIco(iconFile.src, iconFile.dest, { sizes: [16, 24, 32, 48, 64, 128, 256] })
          .then(() => {
            console.log(`Successfully created ${iconFile.dest}`);
          })
          .catch((err) => {
            console.error(`Failed to convert SVG to ICO: ${err}`);
            
            // As a fallback, copy the icon.png to the destination
            if (fs.existsSync(path.join(PUBLIC_DIR, 'icon.png'))) {
              fs.copyFileSync(path.join(PUBLIC_DIR, 'icon.png'), iconFile.dest);
              console.log(`Copied icon.png as fallback for ${iconFile.dest}`);
            }
          });
      } else if (iconFile.src.endsWith('.png')) {
        // For PNG, simply copy to destination
        fs.copyFileSync(iconFile.src, iconFile.dest);
        console.log(`Copied ${iconFile.src} to ${iconFile.dest}`);
      }
    } catch (err) {
      console.error(`Error processing icon ${iconFile.src}: ${err}`);
    }
  } else {
    console.warn(`Source icon not found: ${iconFile.src}`);
  }
}

// Also create a copy of the icons in the build root directory for additional fallback
console.log('Creating fallback icons in build directory...');
try {
  if (fs.existsSync(path.join(BUILD_ICONS_WIN_DIR, 'icon.ico'))) {
    fs.copyFileSync(path.join(BUILD_ICONS_WIN_DIR, 'icon.ico'), path.join(BUILD_DIR, 'icon.ico'));
  }
  if (fs.existsSync(path.join(BUILD_ICONS_WIN_DIR, 'icon-active.ico'))) {
    fs.copyFileSync(path.join(BUILD_ICONS_WIN_DIR, 'icon-active.ico'), path.join(BUILD_DIR, 'icon-active.ico'));
  }
  if (fs.existsSync(path.join(BUILD_ICONS_WIN_DIR, 'icon-inactive.ico'))) {
    fs.copyFileSync(path.join(BUILD_ICONS_WIN_DIR, 'icon-inactive.ico'), path.join(BUILD_DIR, 'icon-inactive.ico'));
  }
} catch (err) {
  console.error('Error creating fallback icons:', err);
}

console.log('Icon path check and fix complete!');
