import { app, BrowserWindow, nativeImage } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { fixWindowsTaskbarIcon } from './windows-taskbar-icon-fix';

/**
 * Creates a tray icon based on the active state
 */
export function createTrayIcon(active: boolean = false) {
  let iconName;
  let iconDir;
  
  console.log(`Creating tray icon (active=${active})`);
  
  // Get the application's root directory
  const appPath = app.getAppPath();
  console.log(`App base path for tray icon: ${appPath}`);
  
  // For Windows, use ICO files for better compatibility in development mode
  if (process.platform === 'win32') {
    // Try the win folder icons first (best practice)
    iconName = active ? 'icon-active.ico' : 'icon-inactive.ico';
    
    if (app.isPackaged) {
      // In packaged app, resources folder contains our assets
      iconDir = path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win');
    } else {
      // In development, use direct path from app root
      iconDir = path.join(appPath, 'build', 'icons', 'win');
    }
    
    // Check if the icon exists in the win folder
    const iconPath = path.join(iconDir, iconName);
    console.log(`Checking for tray icon at: ${iconPath}`);
    
    if (!fs.existsSync(iconPath)) {
      console.log(`Tray icon not found at ${iconPath}, trying build folder`);
      // Fallback to the build folder
      if (app.isPackaged) {
        iconDir = path.join(path.dirname(app.getPath('exe')), 'resources', 'build');
      } else {
        iconDir = path.join(appPath, 'build');
      }
    }
  } else {
    // For other platforms, use SVG
    iconName = active ? 'eye-active.svg' : 'eye-inactive.svg';
    
    if (app.isPackaged) {
      iconDir = path.join(path.dirname(app.getPath('exe')), 'resources', 'public');
    } else {
      iconDir = path.join(appPath, 'public');
    }
  }
  
  // Combine directory and filename
  const iconPath = path.join(iconDir, iconName);
  
  try {
    // Create a native image from the file
    const icon = nativeImage.createFromPath(iconPath);
    
    // For macOS, make it a template image
    if (process.platform === 'darwin') {
      icon.setTemplateImage(true);
    }
    
    // Special handling for high-DPI on Windows
    if (process.platform === 'win32') {
      // Resize to appropriate size for Windows tray
      return icon.resize({ width: 16, height: 16 });
    }
    
    return icon;
  } catch (error) {
    console.error(`Failed to load tray icon (${iconName}):`, error);
      // Try using the default PNG icon as fallback (better compatibility)
    try {
      const fallbackPath = path.join(
        app.isPackaged 
          ? path.dirname(app.getPath('exe')) 
          : path.join(__dirname, '..'),
        'public', 
        'icon.png'
      );
      console.log(`Trying PNG fallback for tray icon: ${fallbackPath}`);
      const pngIcon = nativeImage.createFromPath(fallbackPath);
      if (!pngIcon.isEmpty()) {
        if (process.platform === 'win32') {
          return pngIcon.resize({ width: 16, height: 16 });
        }
        return pngIcon;
      }
      
      // If PNG fails, try SVG as a last resort
      const svgFallbackPath = path.join(
        app.isPackaged 
          ? path.dirname(app.getPath('exe')) 
          : path.join(__dirname, '..'),
        'public', 
        'icon.svg'
      );
      console.log(`Trying SVG fallback for tray icon: ${svgFallbackPath}`);
      return nativeImage.createFromPath(svgFallbackPath);
    } catch (fallbackError) {
      // Return a small empty image as last resort fallback
      console.error('All tray icon fallbacks failed:', fallbackError);
      return nativeImage.createEmpty();
    }
  }
}

/**
 * Creates an app window icon based on the active state
 */
export function createAppIcon(active: boolean = false) {
  // Get the application's root directory
  const appPath = app.getAppPath();
  console.log(`App base path for app icon: ${appPath}`);
  
  if (process.platform === 'win32') {
    try {
      // Always use the state-specific .ico files for Windows when possible
      const icoName = active ? 'icon-active.ico' : 'icon-inactive.ico';
      let icoPath;
      
      if (app.isPackaged) {
        // In packaged app, check multiple resource locations
        const possiblePaths = [
          path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', icoName),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon.ico'),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', icoName),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', 'icon.ico')
        ];
        
        // Find the first path that exists
        for (const testPath of possiblePaths) {
          if (fs.existsSync(testPath)) {
            icoPath = testPath;
            break;
          }
        }
        
        if (!icoPath) {
          icoPath = possiblePaths[0]; // Default to first path even if not found
        }
      } else {
        // In development, look in multiple common locations
        const possiblePaths = [
          path.join(appPath, 'build', 'icons', 'win', icoName),
          path.join(appPath, 'build', 'icons', 'win', 'icon.ico'),
          path.join(appPath, 'build', icoName),
          path.join(appPath, 'build', 'icon.ico')
        ];
        
        // Find the first path that exists
        for (const testPath of possiblePaths) {
          if (fs.existsSync(testPath)) {
            icoPath = testPath;
            break;
          }
        }
        
        // Default to first path if none found
        if (!icoPath) {
          icoPath = possiblePaths[0];
        }
      }
      
      console.log(`Loading Windows taskbar icon from: ${icoPath}`);
      if (fs.existsSync(icoPath)) {
        const icon = nativeImage.createFromPath(icoPath);
        if (!icon.isEmpty()) {
          return icon;
        }
        console.log('Windows ICO icon was empty, falling back to next option');
      } else {
        console.log(`ICO file not found at ${icoPath}, falling back to next option`);
      }
    } catch (error) {
      console.error('Failed to load Windows ICO icon:', error);
      // Fall through to fallback handling
    }
  }
  
  // For non-Windows platforms or as fallback, use SVG
  let iconName = active ? 'eye-active.svg' : 'eye-inactive.svg';
  
  // Determine the correct path to the icon based on whether the app is packaged
  let iconPath;
  if (app.isPackaged) {
    iconPath = path.join(path.dirname(app.getPath('exe')), 'resources', 'public', iconName);
  } else {
    iconPath = path.join(appPath, 'public', iconName);
  }
  
  try {
    // Create a native image from the file
    const icon = nativeImage.createFromPath(iconPath);
    
    // For Windows, we need specific sizes for the taskbar icon
    if (process.platform === 'win32') {
      console.log(`Loading Windows SVG taskbar icon from: ${iconPath}`);
      // Create a larger icon for Windows taskbar
      return icon.resize({ width: 64, height: 64 });
    }
    
    return icon;
  } catch (error) {
    console.error(`Failed to load app icon (${iconName}):`, error);
      // Return default PNG icon as fallback
    try {
      const fallbackPath = path.join(
        app.isPackaged 
          ? path.dirname(app.getPath('exe')) 
          : path.join(__dirname, '..'),
        'public', 
        'icon.png'
      );
      console.log(`Trying PNG fallback icon: ${fallbackPath}`);
      const pngIcon = nativeImage.createFromPath(fallbackPath);
      if (!pngIcon.isEmpty()) {
        if (process.platform === 'win32') {
          return pngIcon.resize({ width: 64, height: 64 });
        }
        return pngIcon;
      }
      
      // If PNG fails, try SVG as a last resort
      const svgFallbackPath = path.join(
        app.isPackaged 
          ? path.dirname(app.getPath('exe')) 
          : path.join(__dirname, '..'),
        'public', 
        'icon.svg'
      );
      console.log(`Trying SVG fallback icon: ${svgFallbackPath}`);
      return nativeImage.createFromPath(svgFallbackPath);
    } catch (fallbackError) {
      console.error('All fallback icons failed:', fallbackError);
      return nativeImage.createEmpty();
    }
  }
}

/**
 * Updates app and tray icons based on active state
 */
export function updateAppIcons(mainWindow: BrowserWindow | null, tray: Electron.Tray | null, active: boolean) {
  console.log(`Updating app icons - active status: ${active}`);
  
  // Update tray icon
  if (tray) {
    try {
      const trayIcon = createTrayIcon(active);
      tray.setImage(trayIcon);
      tray.setToolTip(`NoDoze - ${active ? 'Sleep Prevention Active' : 'Sleep Prevention Inactive'}`);
      console.log('Tray icon updated successfully');
    } catch (trayErr) {
      console.error('Failed to update tray icon:', trayErr);
    }
  }
  
  // Update window icon
  if (mainWindow) {
    try {
      const appIcon = createAppIcon(active);
      mainWindow.setIcon(appIcon);
      console.log('Main window icon updated successfully');
      
      // For Windows, also add an overlay icon when active to make change more visible
      if (process.platform === 'win32') {
        try {
          if (active) {
            // Find a suitable overlay icon
            let overlayPath = '';
            
            const possibleOverlayPaths = [
              // First try the ico files for Windows
              path.join(__dirname, '..', '..', 'build', 'icons', 'win', 'icon-active.ico'),
              path.join(__dirname, '..', '..', 'build', 'icon-active.ico'),
              // Then try SVG and PNG
              path.join(__dirname, '..', 'public', 'eye-active.svg'),
              path.join(__dirname, '..', 'public', 'icon.png')
            ];
            
            for (const testPath of possibleOverlayPaths) {
              if (fs.existsSync(testPath)) {
                overlayPath = testPath;
                break;
              }
            }
            
            if (overlayPath) {
              const overlayIcon = nativeImage.createFromPath(overlayPath).resize({ width: 16, height: 16 });
              mainWindow.setOverlayIcon(overlayIcon, 'Sleep Prevention Active');
              console.log(`Set overlay icon from: ${overlayPath}`);
            } else {
              console.warn('No suitable overlay icon found');
            }
          } else {
            mainWindow.setOverlayIcon(null, '');
            console.log('Cleared overlay icon');
          }
          
          // Explicitly refresh taskbar icon
          if (process.platform === 'win32') {
            fixWindowsTaskbarIcon(mainWindow);
          }
        } catch (err) {
          console.error('Error setting overlay icon:', err);
          mainWindow.setOverlayIcon(null, '');
        }
      }
    } catch (windowErr) {
      console.error('Failed to update window icon:', windowErr);
    }
  }
}
