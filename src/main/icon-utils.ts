/**
 * Utility functions for reliable icon handling in Electron
 * This centralizes all icon path resolution and handling for both
 * development and production environments
 */

import { app, nativeImage } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Resolves an icon path based on the app's environment (packaged or development)
 * @param iconName The filename of the icon to find
 * @returns The fully resolved path to the icon
 */
export function resolveIconPath(iconName: string): string {
  console.log(`Resolving path for icon: ${iconName}`);
  
  // Get the app's base path for consistent path resolution
  const basePath = app.getAppPath();
  console.log(`App base path: ${basePath}`);
  
  const isWindows = process.platform === 'win32';
  const isPackaged = app.isPackaged;
  
  // Create a list of possible paths to check in order of preference
  const possiblePaths: string[] = [];
  
  if (isPackaged) {
    // Resources directory paths in packaged app
    const resourcesPath = path.dirname(app.getPath('exe'));
    
    if (isWindows && iconName.endsWith('.ico')) {
      // Windows ICO files - check in resources/build/icons/win first
      possiblePaths.push(
        path.join(resourcesPath, 'resources', 'build', 'icons', 'win', iconName),
        path.join(resourcesPath, 'resources', 'app', 'build', 'icons', 'win', iconName),
        path.join(resourcesPath, 'resources', 'build', iconName),
        path.join(resourcesPath, 'resources', 'app', 'build', iconName),
        path.join(resourcesPath, iconName) // Try root as well
      );
    } else {
      // Non-Windows or non-ICO - check in resources/public
      possiblePaths.push(
        path.join(resourcesPath, 'resources', 'public', iconName),
        path.join(resourcesPath, 'resources', 'app', 'public', iconName)
      );
    }
  } else {
    // Development environment
    if (isWindows && iconName.endsWith('.ico')) {
      // Windows ICO files - check build/icons/win first
      possiblePaths.push(
        path.join(basePath, 'build', 'icons', 'win', iconName),
        path.join(basePath, 'build', iconName),
        // Extra fallbacks for different directory layouts
        path.join(__dirname, '..', '..', 'build', 'icons', 'win', iconName),
        path.join(__dirname, '..', '..', 'build', iconName)
      );
    } else {
      // Non-Windows or non-ICO - check in public
      possiblePaths.push(
        path.join(basePath, 'public', iconName),
        // Fallbacks
        path.join(__dirname, '..', 'public', iconName),
        path.join(__dirname, '..', '..', 'public', iconName)
      );
    }
  }
  
  // Add general fallbacks
  const pngFallback = 'icon.png';
  possiblePaths.push(
    path.join(basePath, 'public', pngFallback),
    path.join(__dirname, '..', 'public', pngFallback)
  );
  
  // Check each path and return the first one that exists
  for (const iconPath of possiblePaths) {
    try {
      if (fs.existsSync(iconPath)) {
        console.log(`Found icon at: ${iconPath}`);
        return iconPath;
      }
    } catch (error) {
      // Silently continue to next path
    }
  }
  
  // If we get here, no icon was found - return the first path anyway
  // so the calling code can handle the error appropriately
  console.warn(`No icon found for ${iconName} in any location`);
  return possiblePaths[0];
}

/**
 * Gets the appropriate icon path for the tray based on active state
 * @param active Whether sleep prevention is active
 * @returns Path to the tray icon
 */
export function getTrayIconPath(active: boolean): string {
  if (process.platform === 'win32') {
    // Windows uses ICO files for the tray
    const iconName = active ? 'icon-active.ico' : 'icon-inactive.ico';
    return resolveIconPath(iconName);
  } else {
    // macOS and Linux can use SVG
    const iconName = active ? 'eye-active.svg' : 'eye-inactive.svg';
    return resolveIconPath(iconName);
  }
}

/**
 * Gets the appropriate icon path for the window/taskbar based on active state
 * @param active Whether sleep prevention is active
 * @returns Path to the taskbar icon
 */
export function getTaskbarIconPath(active: boolean): string {
  if (process.platform === 'win32') {
    // Windows uses ICO files for taskbar
    const iconName = active ? 'icon-active.ico' : 'icon-inactive.ico';
    return resolveIconPath(iconName);
  } else {
    // For other platforms, we can use PNG/SVG
    return resolveIconPath('icon.png');
  }
}

/**
 * Creates a properly sized icon from a path, with platform-specific handling
 * @param iconPath Path to the icon file
 * @param size Size to resize to (optional)
 * @returns NativeImage
 */
export function createIconFromPath(iconPath: string, size?: number): Electron.NativeImage {
  try {
    if (!fs.existsSync(iconPath)) {
      console.warn(`Icon file does not exist: ${iconPath}`);
      return nativeImage.createEmpty();
    }
    
    // Read the file directly for Windows to avoid caching issues
    if (process.platform === 'win32') {
      const buffer = fs.readFileSync(iconPath);
      const icon = nativeImage.createFromBuffer(buffer);
      
      if (size) {
        return icon.resize({ width: size, height: size });
      }
      return icon;
    } else {
      // For other platforms, normal path loading works fine
      const icon = nativeImage.createFromPath(iconPath);
      
      if (size) {
        return icon.resize({ width: size, height: size });
      }
      
      // For macOS, set template image if appropriate
      if (process.platform === 'darwin') {
        icon.setTemplateImage(true);
      }
      
      return icon;
    }
  } catch (error) {
    console.error(`Error creating icon from ${iconPath}:`, error);
    return nativeImage.createEmpty();
  }
}

/**
 * Creates a tray icon based on active state
 * @param active Whether sleep prevention is active
 * @returns NativeImage for the tray
 */
export function createTrayIcon(active: boolean): Electron.NativeImage {
  const iconPath = getTrayIconPath(active);
  console.log(`Creating tray icon from ${iconPath} (active=${active})`);
  
  // For Windows, tray icons should be 16x16
  if (process.platform === 'win32') {
    return createIconFromPath(iconPath, 16);
  }
  
  return createIconFromPath(iconPath);
}

/**
 * Creates a window/taskbar icon based on active state
 * @param active Whether sleep prevention is active
 * @returns NativeImage for the window/taskbar
 */
export function createTaskbarIcon(active: boolean): Electron.NativeImage {
  const iconPath = getTaskbarIconPath(active);
  console.log(`Creating taskbar icon from ${iconPath} (active=${active})`);
  
  // For Windows, taskbar icons look better at 32x32 or larger
  if (process.platform === 'win32') {
    return createIconFromPath(iconPath, 32);
  }
  
  return createIconFromPath(iconPath);
}

/**
 * Checks if an icon file exists and logs detailed information for debugging
 * @param iconPath Path to the icon file
 * @returns true if the icon exists, false otherwise
 */
export function debugIconPath(iconPath: string): boolean {
  try {
    if (fs.existsSync(iconPath)) {
      const stats = fs.statSync(iconPath);
      console.log(`Icon file exists: ${iconPath}`);
      console.log(`  - Size: ${stats.size} bytes`);
      console.log(`  - Created: ${stats.birthtime}`);
      console.log(`  - Modified: ${stats.mtime}`);
      return true;
    } else {
      console.error(`Icon file does not exist: ${iconPath}`);
      
      // Try to list files in the directory
      try {
        const dir = path.dirname(iconPath);
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          console.log(`Files in directory ${dir}:`);
          files.forEach((file: string) => console.log(`  - ${file}`));
        } else {
          console.error(`Directory does not exist: ${dir}`);
        }
      } catch (dirError) {
        console.error(`Error listing directory:`, dirError);
      }
      return false;
    }
  } catch (error) {
    console.error(`Error checking icon path ${iconPath}:`, error);
    return false;
  }
}
