/**
 * Force Windows Taskbar Icon Update
 * 
 * This utility forces Windows to refresh the taskbar icon by using
 * a variety of techniques to overcome Windows' aggressive icon caching.
 * 
 * NOTE: In production builds, the taskbar icon may not update correctly despite
 * these techniques due to Windows' aggressive caching mechanisms and how
 * Electron applications are packaged. The system tray icon works reliably as
 * the primary visual indicator of application state.
 */

const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * Forces the Windows taskbar icon to update by using multiple techniques
 * @param window The browser window whose icon needs updating
 * @param active Whether the app is in active state or not
 */
async function forceTaskbarIconUpdate(window, active) {
  if (process.platform !== 'win32' || !window) return;

  console.log(`Forcing Windows taskbar icon update to ${active ? 'ACTIVE' : 'INACTIVE'} state`);

  try {
    // Determine if we're in development or production mode
    const isProduction = app.isPackaged;
    console.log(`Running in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);
    
    // Base paths for different environments
    let devPaths = [
      app.getAppPath()
    ];
    
    let prodPaths = [
      path.dirname(app.getPath('exe')),
      path.join(path.dirname(app.getPath('exe')), 'resources'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'app.asar.unpacked')
    ];
    
    // Get icon paths for both states based on environment
    const activeIconPaths = [];
    const inactiveIconPaths = [];
    
    // Add development paths
    if (!isProduction) {
      activeIconPaths.push(
        path.join(app.getAppPath(), 'build', 'icons', 'win', 'eye-active.ico'),
        path.join(app.getAppPath(), 'build', 'eye-active.ico'),
        path.join(app.getAppPath(), 'app.ico')
      );
      inactiveIconPaths.push(
        path.join(app.getAppPath(), 'build', 'icons', 'win', 'eye-inactive.ico'),
        path.join(app.getAppPath(), 'build', 'eye-inactive.ico')
      );
    }
    
    // Add production paths
    if (isProduction) {
      // Try all production base paths with all possible subdirectories
      for (const basePath of prodPaths) {
        activeIconPaths.push(
          path.join(basePath, 'build', 'icons', 'win', 'eye-active.ico'),
          path.join(basePath, 'build', 'eye-active.ico'),
          path.join(basePath, 'app.ico'),
          path.join(basePath, 'eye-active.ico'),
          path.join(basePath, 'icon-active.ico')
        );
        inactiveIconPaths.push(
          path.join(basePath, 'build', 'icons', 'win', 'eye-inactive.ico'),
          path.join(basePath, 'build', 'eye-inactive.ico'),
          path.join(basePath, 'eye-inactive.ico'),
          path.join(basePath, 'icon-inactive.ico')
        );
      }
    }
    
    // Get current icon path based on state
    const iconPaths = active ? activeIconPaths : inactiveIconPaths;
    
    // Find first existing icon
    let iconPath = null;
    console.log('Searching for icon files:');
    for (const path of iconPaths) {
      try {
        const exists = fs.existsSync(path);
        console.log(`  - ${path}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
        if (exists) {
          iconPath = path;
          break;
        }
      } catch (err) {
        console.log(`  - ${path}: ERROR: ${err.message}`);
      }
    }
    
    if (!iconPath) {
      console.error('Could not find appropriate icon file for taskbar update');
      // As a last resort, try using any .ico file we can find
      try {
        const execDir = path.dirname(app.getPath('exe'));
        console.log(`Searching for any .ico file in ${execDir}`);
        const files = fs.readdirSync(execDir);
        for (const file of files) {
          if (file.endsWith('.ico')) {
            iconPath = path.join(execDir, file);
            console.log(`Found backup icon: ${iconPath}`);
            break;
          }
        }
      } catch (err) {
        console.error('Error searching for backup icons:', err);
      }
      
      if (!iconPath) {
        console.error('No suitable icon found - taskbar icon will not update');
        return;
      }
    }
    
    console.log(`Using icon at: ${iconPath} for taskbar force update`);

    // TECHNIQUE 1: Basic icon update with full icon
    const icon = nativeImage.createFromPath(iconPath);
    window.setIcon(icon);
    
    // TECHNIQUE 2: Hide and show window (can help refresh icon)
    const wasVisible = window.isVisible();
    if (wasVisible) {
      window.hide();
      setTimeout(() => {
        window.show();
      }, 100);
    }
    
    // TECHNIQUE 3: Toggle window size slightly
    const bounds = window.getBounds();
    window.setBounds({ 
      x: bounds.x, 
      y: bounds.y, 
      width: bounds.width + 1, 
      height: bounds.height 
    });
    setTimeout(() => {
      window.setBounds(bounds);
    }, 50);
    
    // TECHNIQUE 4: Set window title temporarily (can trigger refresh)
    const currentTitle = window.getTitle();
    window.setTitle(`${currentTitle} `);
    setTimeout(() => {
      window.setTitle(currentTitle);
    }, 50);
    
    // TECHNIQUE 5: Set AppUserModelId again
    app.setAppUserModelId('com.nodoze.app');
    
    console.log('Applied all taskbar icon refresh techniques');
    
  } catch (error) {
    console.error('Error forcing taskbar icon update:', error);
  }
}

module.exports = { forceTaskbarIconUpdate };
