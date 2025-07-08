/**
 * Improved Icon Manager
 * Handles loading and management of application icons for tray and taskbar/dock
 */

import { app, BrowserWindow, nativeImage, Tray } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { fixWindowsTaskbarIcon } from './windows-taskbar-icon-fix';

// Types for icon system
export type IconState = 'active' | 'inactive';
export type IconType = 'tray' | 'app' | 'overlay';
export type Platform = 'win32' | 'darwin' | 'linux';

/**
 * Configuration for icon paths based on platform, environment and state
 */
interface IconConfig {
  // Base paths for different environments
  basePaths: {
    development: {
      [key in Platform]?: string[];
    };
    production: {
      [key in Platform]?: string[];
    };
  };
  
  // Icon file names for different states
  fileNames: {
    [key in IconState]: {
      [key in Platform]?: {
        [key in IconType]?: string[];
      };
    };
  };
  
  // Fallback paths (in order of preference)
  fallbackPaths: {
    [key in Platform]?: {
      [key in IconType]?: string[];
    };
  };
  
  // Icon sizes for different platforms and types
  sizes: {
    [key in Platform]?: {
      [key in IconType]?: {
        width: number;
        height: number;
      };
    };
  };
}

/**
 * Icon configuration for the application
 */
const iconConfig: IconConfig = {
  basePaths: {
    development: {
      win32: [
        path.join(app.getAppPath(), 'build', 'icons', 'win'),
        path.join(app.getAppPath(), 'build'),
        path.join(app.getAppPath(), 'public')
      ],
      darwin: [
        path.join(app.getAppPath(), 'build', 'icons', 'mac'),
        path.join(app.getAppPath(), 'public')
      ],
      linux: [
        path.join(app.getAppPath(), 'build', 'icons', 'linux'),
        path.join(app.getAppPath(), 'public')
      ]
    },
    production: {
      win32: [
        path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win'),
        path.join(path.dirname(app.getPath('exe')), 'resources', 'build'),
        path.join(path.dirname(app.getPath('exe')), 'resources', 'public')
      ],
      darwin: [
        path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'mac'),
        path.join(path.dirname(app.getPath('exe')), 'resources', 'public')
      ],
      linux: [
        path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'linux'),
        path.join(path.dirname(app.getPath('exe')), 'resources', 'public')
      ]
    }
  },
  fileNames: {
    active: {
      win32: {
        tray: ['icon-active.ico', 'icon-active.png', 'eye-active.svg'],
        app: ['icon-active.ico', 'icon.ico', 'icon-active.png', 'icon.png'],
        overlay: ['icon-active.ico', 'icon-active.png', 'eye-active.svg']
      },
      darwin: {
        tray: ['icon-active.svg', 'eye-active.svg', 'icon-active.png', 'icon.png'],
        app: ['icon-active.svg', 'icon-active.icns', 'icon.icns', 'icon-active.png', 'icon.png']
      },
      linux: {
        tray: ['icon-active.png', 'icon-active.svg', 'icon.png', 'icon.svg'],
        app: ['icon-active.png', 'icon.png', 'icon-active.svg', 'icon.svg']
      }
    },
    inactive: {
      win32: {
        tray: ['icon-inactive.ico', 'icon-inactive.png', 'eye-inactive.svg'],
        app: ['icon-inactive.ico', 'icon.ico', 'icon-inactive.png', 'icon.png'],
        overlay: ['icon-inactive.ico', 'icon-inactive.png', 'eye-inactive.svg']
      },
      darwin: {
        tray: ['icon-inactive.svg', 'eye-inactive.svg', 'icon-inactive.png', 'icon.png'],
        app: ['icon-inactive.svg', 'icon-inactive.icns', 'icon.icns', 'icon-inactive.png', 'icon.png']
      },
      linux: {
        tray: ['icon-inactive.png', 'icon-inactive.svg', 'icon.png', 'icon.svg'],
        app: ['icon-inactive.png', 'icon.png', 'icon-inactive.svg', 'icon.svg']
      }
    }
  },
  fallbackPaths: {
    win32: {
      tray: ['public/icon.png', 'public/icon.svg'],
      app: ['public/icon.png', 'public/icon.svg'],
      overlay: ['public/icon.png', 'public/icon.svg']
    },
    darwin: {
      tray: ['public/icon.png', 'public/icon.svg'],
      app: ['public/icon.png', 'public/icon.svg']
    },
    linux: {
      tray: ['public/icon.png', 'public/icon.svg'],
      app: ['public/icon.png', 'public/icon.svg']
    }
  },
  sizes: {
    win32: {
      tray: { width: 16, height: 16 },
      app: { width: 64, height: 64 },
      overlay: { width: 16, height: 16 }
    },
    darwin: {
      tray: { width: 22, height: 22 }
    },
    linux: {
      tray: { width: 24, height: 24 }
    }
  }
};

/**
 * Icon Manager class for handling all icon-related functionality
 */
export class IconManager {
  private platform: Platform;
  private isPackaged: boolean;
  
  constructor() {
    this.platform = process.platform as Platform;
    this.isPackaged = app.isPackaged;
  }
  
  /**
   * Load an icon based on state, type and platform
   */
  public loadIcon(state: IconState, type: IconType): Electron.NativeImage {
    console.log(`Loading ${type} icon for state: ${state} on platform: ${this.platform}`);
    
    try {
      // Get icon paths for the current platform and state
      const iconPath = this.findIconPath(state, type);
      if (!iconPath) {
        console.error(`No suitable icon found for ${type} (${state})`);
        return this.createEmptyIcon();
      }
      
      console.log(`Found icon at: ${iconPath}`);
      let icon = nativeImage.createFromPath(iconPath);
      
      // Resize icon if needed
      icon = this.resizeIconIfNeeded(icon, type);
      
      // Special handling for macOS template images
      if (this.platform === 'darwin' && type === 'tray') {
        icon.setTemplateImage(true);
      }
      
      return icon;
    } catch (error) {
      console.error(`Failed to load ${type} icon (${state}):`, error);
      return this.loadFallbackIcon(type);
    }
  }
  
  /**
   * Find the path to an icon based on state and type
   */
  private findIconPath(state: IconState, type: IconType): string | null {
    // Get base paths for the current environment
    const basePaths = this.isPackaged 
      ? iconConfig.basePaths.production[this.platform] || []
      : iconConfig.basePaths.development[this.platform] || [];
    
    // Get file names for the current state and platform
    const fileNames = iconConfig.fileNames[state][this.platform]?.[type] || [];
    
    // Try each base path with each file name
    for (const basePath of basePaths) {
      for (const fileName of fileNames) {
        const iconPath = path.join(basePath, fileName);
        if (fs.existsSync(iconPath)) {
          return iconPath;
        }
      }
    }
    
    return null;
  }
  
  /**
   * Load a fallback icon when the primary icon can't be found
   */
  private loadFallbackIcon(type: IconType): Electron.NativeImage {
    console.log(`Attempting to load fallback icon for ${type}`);
    
    // Get fallback paths for the current platform
    const fallbackPaths = iconConfig.fallbackPaths[this.platform]?.[type] || [];
    
    for (const relativePath of fallbackPaths) {
      try {
        const basePath = this.isPackaged 
          ? path.dirname(app.getPath('exe'))
          : app.getAppPath();
        
        const iconPath = path.join(basePath, relativePath);
        
        if (fs.existsSync(iconPath)) {
          console.log(`Using fallback icon: ${iconPath}`);
          let icon = nativeImage.createFromPath(iconPath);
          
          // Resize fallback icon if needed
          icon = this.resizeIconIfNeeded(icon, type);
          return icon;
        }
      } catch (error) {
        console.error(`Failed to load fallback icon from ${relativePath}:`, error);
      }
    }
    
    console.error(`All fallback icons failed for ${type}`);
    return this.createEmptyIcon();
  }
  
  /**
   * Resize an icon based on platform and type requirements
   */
  private resizeIconIfNeeded(icon: Electron.NativeImage, type: IconType): Electron.NativeImage {
    const size = iconConfig.sizes[this.platform]?.[type];
    
    if (size && !icon.isEmpty()) {
      return icon.resize(size);
    }
    
    return icon;
  }
  
  /**
   * Create an empty icon (last resort fallback)
   */
  private createEmptyIcon(): Electron.NativeImage {
    console.warn('Creating empty icon as last resort fallback');
    return nativeImage.createEmpty();
  }
  
  /**
   * Get a tray icon based on active state
   */
  public getTrayIcon(active: boolean): Electron.NativeImage {
    return this.loadIcon(active ? 'active' : 'inactive', 'tray');
  }
  
  /**
   * Get an app icon based on active state
   */
  public getAppIcon(active: boolean): Electron.NativeImage {
    return this.loadIcon(active ? 'active' : 'inactive', 'app');
  }
  
  /**
   * Get an overlay icon based on active state
   */
  public getOverlayIcon(active: boolean): Electron.NativeImage {
    return this.loadIcon(active ? 'active' : 'inactive', 'overlay');
  }
  
  /**
   * Update all application icons based on active state
   */
  public updateAppIcons(
    mainWindow: BrowserWindow | null, 
    tray: Tray | null, 
    active: boolean
  ): void {
    console.log(`Updating all app icons - active status: ${active}`);
    
    // Update tray icon
    if (tray) {
      try {
        const trayIcon = this.getTrayIcon(active);
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
        const appIcon = this.getAppIcon(active);
        mainWindow.setIcon(appIcon);
        console.log('Main window icon updated successfully');
        
        // For Windows, also add an overlay icon when active
        if (this.platform === 'win32') {
          try {
            if (active) {
              const overlayIcon = this.getOverlayIcon(active);
              mainWindow.setOverlayIcon(overlayIcon, 'Sleep Prevention Active');
              console.log('Set overlay icon successfully');
            } else {
              mainWindow.setOverlayIcon(null, '');
              console.log('Cleared overlay icon');
            }
          } catch (overlayErr) {
            console.error('Failed to set overlay icon:', overlayErr);
          }
        }
      } catch (appIconErr) {
        console.error('Failed to update app icon:', appIconErr);
      }
      
      // Apply Windows-specific taskbar icon fixes
      if (this.platform === 'win32') {
        try {
          fixWindowsTaskbarIcon(mainWindow);
        } catch (fixErr) {
          console.error('Failed to apply Windows taskbar icon fix:', fixErr);
        }
      }
    }
  }
}

// Create and export a singleton instance
const iconManager = new IconManager();
export default iconManager;

// Legacy API for backward compatibility
export function createTrayIcon(active: boolean = false): Electron.NativeImage {
  return iconManager.getTrayIcon(active);
}

export function createAppIcon(active: boolean = false): Electron.NativeImage {
  return iconManager.getAppIcon(active);
}

export function updateAppIcons(
  mainWindow: BrowserWindow | null, 
  tray: Tray | null, 
  active: boolean
): void {
  iconManager.updateAppIcons(mainWindow, tray, active);
}
