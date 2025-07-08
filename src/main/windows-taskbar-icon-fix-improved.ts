/**
 * Enhanced Windows Taskbar Icon Fix
 * 
 * This utility addresses the common issue where Electron apps show the default Electron icon
 * in the Windows taskbar even when custom icons are set.
 * 
 * Enhanced version with:
 * - Improved icon detection
 * - More robust fallback mechanisms
 * - Better logging
 * - Cleaner code organization
 */

import { app, BrowserWindow, nativeImage } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// Type definitions for clarity
interface IconFix {
  name: string;
  execute: (window: BrowserWindow) => Promise<boolean>;
  description: string;
}

/**
 * Apply Windows-specific fixes to ensure the taskbar icon shows correctly
 * Call this after creating your BrowserWindow
 */
export async function fixWindowsTaskbarIcon(window: BrowserWindow | null): Promise<boolean> {
  if (!window || process.platform !== 'win32') {
    return false;
  }
  
  console.log('Applying Windows taskbar icon fixes...');
  
  // Get the application's root directory
  const appPath = app.getAppPath();
  console.log(`App base path for taskbar fix: ${appPath}`);
  
  // Define icon fixes in order of preference/effectiveness
  const iconFixes: IconFix[] = [
    {
      name: 'multi-size-icons',
      execute: applyMultiSizeIcons,
      description: 'Apply multiple icon sizes to window'
    },
    {
      name: 'app-user-model-id',
      execute: setAppUserModelId,
      description: 'Set AppUserModelId for proper taskbar grouping'
    },
    {
      name: 'copy-icon-to-exe-dir',
      execute: copyIconToExeDir,
      description: 'Copy icon to app.exe directory for direct access'
    },
    {
      name: 'overlay-icon-refresh',
      execute: applyOverlayIconRefresh,
      description: 'Apply and clear overlay icons to refresh icon cache'
    }
  ];
  
  let overallSuccess = false;
  
  // Try each fix in sequence
  for (const fix of iconFixes) {
    try {
      console.log(`Applying taskbar icon fix: ${fix.name} - ${fix.description}`);
      const success = await fix.execute(window);
      
      if (success) {
        console.log(`Taskbar icon fix "${fix.name}" applied successfully`);
        overallSuccess = true;
      } else {
        console.warn(`Taskbar icon fix "${fix.name}" did not succeed`);
      }
    } catch (error) {
      console.error(`Error applying taskbar icon fix "${fix.name}":`, error);
    }
  }
  
  if (overallSuccess) {
    console.log('Windows taskbar icon fixes applied successfully');
  } else {
    console.warn('All Windows taskbar icon fixes failed');
  }
  
  return overallSuccess;
}

/**
 * Find a suitable icon file for the taskbar
 * Returns the path to the icon file or null if not found
 */
async function findSuitableIcon(): Promise<string | null> {
  // Try all possible icon paths in order of preference
  let possibleIconPaths;
  
  if (app.isPackaged) {
    // Paths for packaged app (production)
    possibleIconPaths = [
      // Check resources/build/icons/win folder first (typical for packaged app)
      path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon.ico'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon-active.ico'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon-inactive.ico'),
      // Try resources/build as alternative
      path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icon.ico'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icon-active.ico'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icon-inactive.ico'),
      // Try resources/app/build as another alternative
      path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icon.ico'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icon-active.ico'),
      // Try direct resources directory icons
      path.join(path.dirname(app.getPath('exe')), 'resources', 'icon.ico'),
      // Try public folder for fallbacks
      path.join(path.dirname(app.getPath('exe')), 'resources', 'public', 'icon.png'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'public', 'icon.svg'),
      // Try root folder as last resort
      path.join(path.dirname(app.getPath('exe')), 'icon.ico')
    ];
  } else {
    // Paths for development
    possibleIconPaths = [
      // Check the build/icons/win folder first (best for Windows)
      path.join(app.getAppPath(), 'build', 'icons', 'win', 'icon.ico'),
      path.join(app.getAppPath(), 'build', 'icons', 'win', 'icon-active.ico'),
      path.join(app.getAppPath(), 'build', 'icons', 'win', 'icon-inactive.ico'),
      // Then try the standalone icons in build folder
      path.join(app.getAppPath(), 'build', 'icon.ico'),
      path.join(app.getAppPath(), 'build', 'icon-active.ico'),
      path.join(app.getAppPath(), 'build', 'icon-inactive.ico'),
      // Then try public folder
      path.join(app.getAppPath(), 'public', 'icon.png'),
      path.join(app.getAppPath(), 'public', 'icon-active.svg'),
      path.join(app.getAppPath(), 'public', 'icon.svg'),
      // Then try app root
      path.join(app.getAppPath(), 'icon.ico'),
      path.join(app.getAppPath(), 'app.ico')
    ];
  }
  
  // Find the first icon that exists
  for (const iconPath of possibleIconPaths) {
    try {
      if (fs.existsSync(iconPath)) {
        console.log(`Found suitable icon at: ${iconPath}`);
        return iconPath;
      }
    } catch (e) {
      console.error(`Error checking icon path: ${iconPath}`, e);
    }
  }
  
  console.warn('Could not find any suitable icons for Windows taskbar');
  return null;
}

/**
 * Fix 1: Apply multiple icon sizes to the window
 * This helps Windows properly display the icon in different contexts
 */
async function applyMultiSizeIcons(window: BrowserWindow): Promise<boolean> {
  try {
    const iconPath = await findSuitableIcon();
    if (!iconPath) return false;
    
    console.log(`Applying multiple icon sizes from: ${iconPath}`);
    
    // For ICO files, Electron will automatically extract different sizes
    if (path.extname(iconPath).toLowerCase() === '.ico') {
      window.setIcon(iconPath);
      console.log('Set ICO icon with multiple sizes');
      return true;
    }
    
    // For other formats, we need to manually resize
    const sizes = [16, 24, 32, 48, 64, 128];
    let baseIcon = nativeImage.createFromPath(iconPath);
    
    if (baseIcon.isEmpty()) {
      console.warn('Icon is empty, cannot resize');
      return false;
    }
    
    // Apply each size to the window
    for (const size of sizes) {
      try {
        const resizedIcon = baseIcon.resize({ width: size, height: size });
        window.setIcon(resizedIcon);
        console.log(`Applied ${size}x${size} icon to Windows taskbar`);
      } catch (err) {
        console.error(`Failed to resize icon to ${size}x${size}:`, err);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error applying multi-size icons:', error);
    return false;
  }
}

/**
 * Fix 2: Set AppUserModelId for proper taskbar grouping
 * This helps Windows associate the window with the correct application
 */
async function setAppUserModelId(window: BrowserWindow): Promise<boolean> {
  try {
    // Get application name from package.json or use default
    let appId = 'com.electron.nodozesleepprevention';
    
    try {
      const packageJsonPath = path.join(app.getAppPath(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.name) {
        appId = packageJson.name.replace(/[^a-zA-Z0-9]/g, '.');
        if (packageJson.author) {
          const author = typeof packageJson.author === 'string' ? 
            packageJson.author : 
            packageJson.author.name;
          appId = `com.${author.replace(/[^a-zA-Z0-9]/g, '.')}.${appId}`;
        } else {
          appId = `com.electron.${appId}`;
        }
      }
    } catch (e) {
      console.error('Error reading package.json:', e);
    }
    
    window.setAppDetails({ appId });
    console.log(`Set AppUserModelId to: ${appId}`);
    
    return true;
  } catch (error) {
    console.error('Error setting AppUserModelId:', error);
    return false;
  }
}

/**
 * Fix 3: Copy icon to app.exe directory for direct access
 * This is a known workaround for Windows taskbar icon issues
 */
async function copyIconToExeDir(window: BrowserWindow): Promise<boolean> {
  if (!app.isPackaged) {
    console.log('Skipping copy-to-exe-dir fix in development mode');
    return false;
  }
  
  try {
    const iconPath = await findSuitableIcon();
    if (!iconPath) return false;
    
    // Copy the icon to the app.exe directory as app.ico
    // This is a known workaround for Windows taskbar icon issues
    const appExePath = app.getPath('exe');
    const appExeDir = path.dirname(appExePath);
    const appIcoPath = path.join(appExeDir, 'app.ico');
    
    // Only copy if source and destination are different
    if (path.normalize(iconPath) !== path.normalize(appIcoPath)) {
      fs.copyFileSync(iconPath, appIcoPath);
      console.log(`Copied icon to ${appIcoPath} (Windows taskbar workaround)`);
      
      // Apply this icon to the window
      window.setIcon(appIcoPath);
      return true;
    } else {
      console.log('Icon is already in the exe directory, skipping copy');
      return false;
    }
  } catch (error) {
    console.error('Error copying icon to exe directory:', error);
    return false;
  }
}

/**
 * Fix 4: Apply and clear overlay icons to refresh icon cache
 * Sometimes this helps "refresh" the taskbar icon cache
 */
async function applyOverlayIconRefresh(window: BrowserWindow): Promise<boolean> {
  try {
    const iconPath = await findSuitableIcon();
    if (!iconPath) return false;
    
    // Technique 4: Use same icon as taskbar overlay and clear it
    // Sometimes this helps "refresh" the taskbar icon cache
    console.log('Applying overlay icon refresh technique');
    
    try {
      const smallIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
      if (!smallIcon.isEmpty()) {
        // Set and then clear the overlay icon
        window.setOverlayIcon(smallIcon, 'Taskbar Icon Fix');
        setTimeout(() => {
          window.setOverlayIcon(null, '');
        }, 1000);
        console.log('Applied and cleared taskbar overlay icon as refresh technique');
        return true;
      }
    } catch (err) {
      console.error('Error applying overlay icon refresh:', err);
    }
    
    return false;
  } catch (error) {
    console.error('Error applying overlay icon refresh:', error);
    return false;
  }
}
