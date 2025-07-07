/**
 * Special utility for forcing Windows taskbar icon updates
 * This uses aggressive techniques to overcome Windows icon caching issues
 */

import { BrowserWindow, app, nativeImage } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Force update the Windows taskbar icon to reflect the current state
 * @param window The main application window
 * @param isActive Whether sleep prevention is active
 * @returns True if successful, false otherwise
 */
export function forceWindowsTaskbarIconUpdate(window: BrowserWindow | null, isActive: boolean): boolean {
  if (!window || process.platform !== 'win32') return false;

  console.log(`Forcing Windows taskbar icon update (active=${isActive})`);
  
  try {    // 1. Determine the correct icon path
    const iconName = isActive ? 'icon-active.ico' : 'icon-inactive.ico';
    let iconPath = '';
    
    // ALWAYS use absolute paths via app.getAppPath()
    const appPath = app.getAppPath(); // Get the application's root directory
    console.log(`App path for icon search: ${appPath}`);
    
    // Check for icons in production vs development locations
    const possiblePaths = app.isPackaged
      ? [
          // Production paths
          path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', iconName),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon.ico'),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', iconName),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', 'icon.ico'),
          // PNG fallbacks
          path.join(path.dirname(app.getPath('exe')), 'resources', 'public', 'icon.png')
        ]
      : [
          // Development paths
          path.join(appPath, 'build', 'icons', 'win', iconName),
          path.join(appPath, 'build', 'icons', 'win', 'icon.ico'),
          path.join(appPath, 'build', iconName),
          path.join(appPath, 'build', 'icon.ico'),
          // PNG fallback
          path.join(appPath, 'public', 'icon.png')
        ];
    
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        iconPath = testPath;
        console.log(`Using icon from: ${iconPath}`);
        break;
      }
    }
    
    if (!iconPath) {
      console.error('No suitable icon found for Windows taskbar update');
      return false;
    }
    
    // 2. Load the icon with all possible sizes
    const icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) {
      console.error(`Failed to load icon from ${iconPath}`);
      return false;
    }
    
    // 3. Apply multiple aggressive techniques to force the update
    
    // Technique 1: Set the window icon multiple times with different sizes
    window.setIcon(icon);
    
    // Windows uses different icon sizes in different contexts, so set multiple sizes
    const sizes = [16, 24, 32, 48, 64, 128, 256];
    for (const size of sizes) {
      try {
        const resizedIcon = icon.resize({ width: size, height: size });
        window.setIcon(resizedIcon);
      } catch (e) {
        // Ignore resize errors
      }
    }
    
    // Technique 2: Use overlay icon as a trigger to refresh the taskbar
    try {
      // First set an overlay
      const overlayIcon = icon.resize({ width: 16, height: 16 });
      window.setOverlayIcon(overlayIcon, isActive ? 'Active' : 'Inactive');
      
      // Then clear it after a delay
      setTimeout(() => {
        if (isActive) {
          // If active, keep a small overlay to indicate status
          const smallOverlay = icon.resize({ width: 10, height: 10 });
          window.setOverlayIcon(smallOverlay, 'Active');
        } else {
          window.setOverlayIcon(null, '');
        }
      }, 500);
    } catch (e) {
      console.warn('Overlay icon technique failed:', e);
    }    // Technique 3: Copy to Electron executable directory (extreme fallback)
    try {
      // This technique can be useful in both production and development
      const execPath = process.execPath;
      const appDir = path.dirname(execPath);
      const appIconPath = path.join(appDir, 'app.ico');
      
      console.log(`Attempting to copy ${iconPath} to ${appIconPath}`);
      // Verify icon exists before copying
      if (fs.existsSync(iconPath)) {
        fs.copyFileSync(iconPath, appIconPath);
        console.log(`Copied icon to Electron exe directory: ${appIconPath}`);
      } else {
        console.warn(`Source icon doesn't exist at ${iconPath}, skipping copy`);
      }
    } catch (e) {
      console.warn('Failed to copy icon to exe directory:', e);
    }
    
    // Technique 4: Window manipulation to force a refresh
    try {
      // Save current state
      const wasVisible = window.isVisible();
      const wasFocused = window.isFocused();
      const bounds = window.getBounds();
      
      // Force a slight resize to trigger a window update
      window.setBounds({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width + 1,
        height: bounds.height
      });
      
      // Restore original size after a short delay
      setTimeout(() => {
        window.setBounds(bounds);
        
        // Ensure window state is preserved
        if (wasVisible && !window.isVisible()) window.show();
        if (wasFocused && !window.isFocused()) window.focus();
      }, 100);
    } catch (e) {
      console.warn('Window manipulation technique failed:', e);
    }
    
    console.log('Windows taskbar icon update applied successfully');
    return true;
  } catch (error) {
    console.error('Failed to update Windows taskbar icon:', error);
    return false;
  }
}
