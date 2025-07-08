/**
 * Ensure Icons Available
 * 
 * This utility copies icon files to the expected production locations
 * to ensure that the taskbar icon can be properly updated in a built app.
 */

const { app } = require('electron');
const fs = require('fs');
const path = require('path');

/**
 * Copies icon files to production locations to ensure they're available
 * This is particularly important for electron-builder packaged apps
 */
async function ensureIconsAvailable() {
  console.log('Ensuring icon files are available in production environment...');
  
  try {
    const isProduction = app.isPackaged;
    if (!isProduction) {
      console.log('Development mode detected, skipping production icon setup');
      return;
    }
    
    console.log('Production mode detected, ensuring icon files are available');
    
    // Source icon paths (look in multiple possible locations)
    const sourcePaths = [
      app.getAppPath(),
      path.join(path.dirname(app.getPath('exe')), 'resources'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'app.asar.unpacked'),
      path.dirname(app.getPath('exe'))
    ];
    
    // Find source icons
    let eyeActiveIcoPath = null;
    let eyeInactiveIcoPath = null;
    
    for (const basePath of sourcePaths) {
      // Check different possible locations
      const possibleActivePaths = [
        path.join(basePath, 'build', 'icons', 'win', 'eye-active.ico'),
        path.join(basePath, 'build', 'eye-active.ico'),
        path.join(basePath, 'eye-active.ico')
      ];
      
      const possibleInactivePaths = [
        path.join(basePath, 'build', 'icons', 'win', 'eye-inactive.ico'),
        path.join(basePath, 'build', 'eye-inactive.ico'),
        path.join(basePath, 'eye-inactive.ico')
      ];
      
      // Look for active icon
      for (const p of possibleActivePaths) {
        try {
          if (fs.existsSync(p)) {
            eyeActiveIcoPath = p;
            console.log(`Found active icon at: ${p}`);
            break;
          }
        } catch (err) {
          // Ignore errors
        }
      }
      
      // Look for inactive icon
      for (const p of possibleInactivePaths) {
        try {
          if (fs.existsSync(p)) {
            eyeInactiveIcoPath = p;
            console.log(`Found inactive icon at: ${p}`);
            break;
          }
        } catch (err) {
          // Ignore errors
        }
      }
      
      // If we found both icons, we can stop searching
      if (eyeActiveIcoPath && eyeInactiveIcoPath) break;
    }
    
    if (!eyeActiveIcoPath || !eyeInactiveIcoPath) {
      console.error('Could not find source icon files');
      
      // Try to find any .ico files as a fallback
      if (!eyeActiveIcoPath) {
        for (const basePath of sourcePaths) {
          try {
            const files = fs.readdirSync(basePath);
            for (const file of files) {
              if (file.endsWith('.ico')) {
                eyeActiveIcoPath = path.join(basePath, file);
                console.log(`Using fallback active icon: ${eyeActiveIcoPath}`);
                break;
              }
            }
            if (eyeActiveIcoPath) break;
          } catch (err) {
            // Ignore errors
          }
        }
      }
      
      if (!eyeInactiveIcoPath && eyeActiveIcoPath) {
        // Use the active icon for inactive as well if needed
        eyeInactiveIcoPath = eyeActiveIcoPath;
        console.log(`Using active icon for inactive as well`);
      }
      
      if (!eyeActiveIcoPath) {
        console.error('Could not find any icons, giving up');
        return;
      }
    }
    
    // Target paths where icons should be copied
    const exeDir = path.dirname(app.getPath('exe'));
    const targetPaths = [
      { source: eyeActiveIcoPath, dest: path.join(exeDir, 'eye-active.ico') },
      { source: eyeInactiveIcoPath, dest: path.join(exeDir, 'eye-inactive.ico') },
      { source: eyeActiveIcoPath, dest: path.join(exeDir, 'app.ico') }
    ];
    
    // Copy the icons
    for (const { source, dest } of targetPaths) {
      try {
        fs.copyFileSync(source, dest);
        console.log(`✓ Copied ${source} to ${dest}`);
      } catch (err) {
        console.error(`✗ Failed to copy ${source} to ${dest}: ${err.message}`);
      }
    }
    
    console.log('Finished ensuring icon files are available');
    
  } catch (err) {
    console.error('Error ensuring icons available:', err);
  }
}

module.exports = { ensureIconsAvailable };
