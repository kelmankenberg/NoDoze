/**
 * Special utility for fixing Windows taskbar icons
 * This addresses a common issue where Electron apps show the default Electron icon
 * in the Windows taskbar even when custom icons are set
 */

import { app, BrowserWindow, nativeImage } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Apply special Windows-specific fixes to ensure the taskbar icon shows correctly
 * Call this after creating your BrowserWindow
 */
export function fixWindowsTaskbarIcon(window: BrowserWindow | null): void {
  if (!window || process.platform !== 'win32') return;
    // Get the application's root directory
  const appPath = app.getAppPath();
  console.log(`App base path for taskbar fix: ${appPath}`);
  
  // Try all possible icon paths in order of preference
  let possibleIconPaths;
  
  if (app.isPackaged) {
    // Paths for packaged app (production)
    possibleIconPaths = [
      // Check resources/build/icons/win folder first (typical for packaged app)
      path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon.ico'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon-active.ico'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon-inactive.ico'),
      // Try resources/app/build as alternative
      path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', 'icon.ico'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', 'icon-active.ico'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', 'icon-inactive.ico'),
      // Try direct resources directory icons
      path.join(path.dirname(app.getPath('exe')), 'resources', 'icon.ico'),
      // Finally try PNG and SVG as last resorts
      path.join(path.dirname(app.getPath('exe')), 'resources', 'public', 'icon.png'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'public', 'icon.svg')
    ];
  } else {
    // Paths for development
    possibleIconPaths = [
      // Check the build/icons/win folder first (best for Windows)
      path.join(appPath, 'build', 'icons', 'win', 'icon.ico'),
      path.join(appPath, 'build', 'icons', 'win', 'icon-active.ico'),
      path.join(appPath, 'build', 'icons', 'win', 'icon-inactive.ico'),
      // Then try the standalone icons in build folder
      path.join(appPath, 'build', 'icon.ico'),
      path.join(appPath, 'build', 'icon-active.ico'),
      path.join(appPath, 'build', 'icon-inactive.ico'),
      // Finally try PNG and SVG as last resorts
      path.join(appPath, 'public', 'icon.png'),
      path.join(appPath, 'public', 'icon.svg')
    ];
  }
  
  console.log('Attempting aggressive Windows taskbar icon fix...');
  
  // Find first valid icon to use
  let validIconPath = '';
  for (const iconPath of possibleIconPaths) {
    try {
      if (fs.existsSync(iconPath)) {
        console.log(`Found valid icon at: ${iconPath}`);
        validIconPath = iconPath;
        break;
      }
    } catch (error) {
      // Skip errors and continue to next path
    }
  }
  
  if (!validIconPath) {
    console.warn('Could not find any suitable icons for Windows taskbar');
    return;
  }
    // Apply the strongest possible icon-setting techniques
  try {
    console.log(`Applying aggressive Windows taskbar icon fix with: ${validIconPath}`);
    
    // Technique 1: Set icon through BrowserWindow options
    // (This already happened during window creation, but we'll apply it again)
    const icon = nativeImage.createFromPath(validIconPath);
    if (!icon.isEmpty()) {
      // Apply the base icon
      window.setIcon(icon);
      
      // Technique 2: Apply multiple size variants for different Windows contexts
      // Windows uses different sizes in different UI contexts
      const sizesToApply = [16, 24, 32, 48, 64, 96, 128, 256];
      for (const size of sizesToApply) {
        try {
          const sizedIcon = icon.resize({ width: size, height: size });
          window.setIcon(sizedIcon);
          console.log(`Applied ${size}x${size} icon to Windows taskbar`);
        } catch (e) {
          // Ignore resize errors
        }
      }
        // Technique 3: Copy to app.ico in Electron executable directory
      // This is a known workaround for Windows taskbar icon issues
      try {
        // Also place a copy in the directory with the executable
        const appExePath = process.execPath;
        const appDir = path.dirname(appExePath);
        const appIcoPath = path.join(appDir, 'app.ico');
        
        // Make sure the source icon exists before copying
        if (fs.existsSync(validIconPath)) {
          fs.copyFileSync(validIconPath, appIcoPath);
          console.log(`Copied icon to ${appIcoPath} (Windows taskbar workaround)`);
          
          // For packaged apps, also try copying to resources directory
          if (app.isPackaged) {
            try {
              const resourcesDir = path.join(appDir, 'resources');
              if (fs.existsSync(resourcesDir)) {
                const resourcesIconPath = path.join(resourcesDir, 'app.ico');
                fs.copyFileSync(validIconPath, resourcesIconPath);
                console.log(`Also copied icon to ${resourcesIconPath}`);
              }
            } catch (copyErr) {
              console.log('Failed to copy to resources directory:', copyErr);
            }
          }
        } else {
          console.warn(`Source icon doesn't exist at ${validIconPath}, can't copy to exe directory`);
        }
      } catch (err) {
        console.log('Could not apply app.ico executable directory workaround:', err);
      }
      
      // Technique 4: Use same icon as taskbar overlay and clear it
      // Sometimes this helps "refresh" the taskbar icon cache
      try {
        const smallIcon = icon.resize({ width: 16, height: 16 });
        window.setOverlayIcon(smallIcon, 'Taskbar Icon Fix');
        
        // Clear the overlay after a short delay
        setTimeout(() => {
          window.setOverlayIcon(null, '');
        }, 1000);
        
        console.log('Applied and cleared taskbar overlay icon as refresh technique');
      } catch (overlayError) {
        console.log('Overlay icon technique failed:', overlayError);
      }
      
      console.log('All Windows taskbar icon fix techniques applied successfully');
      return; // Exit function successfully
    } else {
      console.warn(`Icon at ${validIconPath} is empty, trying other techniques`);
    }
  } catch (error) {
    console.error(`Failed to apply icon ${validIconPath}:`, error);
  }
  
  // Only show this warning if we didn't find any icons earlier
  if (!validIconPath) {
    console.warn('Could not find any suitable icons for Windows taskbar');
  }
}
