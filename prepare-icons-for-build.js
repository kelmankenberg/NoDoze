/**
 * Prepare Icons for Build
 * 
 * This script ensures that all icon files needed for the taskbar and system tray
 * are properly prepared and copied to the right locations before packaging.
 */

const fs = require('fs');
const path = require('path');

/**
 * Copy a file with directory creation if needed
 */
function copyFileWithDirCreation(source, target) {
  try {
    // Create target directory if it doesn't exist
    const targetDir = path.dirname(target);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy the file
    fs.copyFileSync(source, target);
    console.log(`✓ Copied ${source} to ${target}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to copy ${source} to ${target}:`, error);
    return false;
  }
}

/**
 * Prepare icons for build
 */
async function prepareIconsForBuild() {
  console.log('Preparing icons for build...');
  
  const rootDir = process.cwd();
  const buildDir = path.join(rootDir, 'build');
  const publicDir = path.join(rootDir, 'public');
  
  // Create build directory if it doesn't exist
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // Define icon sources and targets
  const iconsToCopy = [
    // Copy eye icons from public to build dir
    {
      source: path.join(publicDir, 'eye-active.svg'),
      target: path.join(buildDir, 'eye-active.svg')
    },
    {
      source: path.join(publicDir, 'eye-inactive.svg'),
      target: path.join(buildDir, 'eye-inactive.svg')
    },
    // If eye-*.ico files exist, copy them
    {
      source: path.join(rootDir, 'build', 'icons', 'win', 'eye-active.ico'),
      target: path.join(buildDir, 'eye-active.ico')
    },
    {
      source: path.join(rootDir, 'build', 'icons', 'win', 'eye-inactive.ico'),
      target: path.join(buildDir, 'eye-inactive.ico')
    },
    // Copy any backup/fallback icons
    {
      source: path.join(rootDir, 'build', 'icon.ico'),
      target: path.join(buildDir, 'icon.ico')
    }
  ];
  
  // Copy each icon
  for (const { source, target } of iconsToCopy) {
    try {
      if (fs.existsSync(source)) {
        copyFileWithDirCreation(source, target);
      } else {
        console.log(`Source file does not exist: ${source}`);
      }
    } catch (err) {
      console.error(`Error processing ${source}:`, err);
    }
  }
  
  // Make special copies of eye icons in the build root
  try {
    // Try to find eye-active.ico first in win folder, then in build
    let eyeActiveSource = path.join(rootDir, 'build', 'icons', 'win', 'eye-active.ico');
    if (!fs.existsSync(eyeActiveSource)) {
      eyeActiveSource = path.join(buildDir, 'eye-active.ico');
    }
    
    // If eye-active.ico exists, copy it as app.ico
    if (fs.existsSync(eyeActiveSource)) {
      const appIcoTarget = path.join(buildDir, 'app.ico');
      copyFileWithDirCreation(eyeActiveSource, appIcoTarget);
      
      // Also copy to root for immediate availability
      copyFileWithDirCreation(eyeActiveSource, path.join(rootDir, 'app.ico'));
    } else {
      console.log('Could not find eye-active.ico to copy as app.ico');
    }
  } catch (err) {
    console.error('Error creating app.ico:', err);
  }
  
  console.log('Icons prepared for build');
}

// Run the function
prepareIconsForBuild().catch(err => {
  console.error('Error preparing icons for build:', err);
  process.exit(1);
});
