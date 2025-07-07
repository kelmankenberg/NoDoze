import { app, BrowserWindow, Tray, nativeImage } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Update the tray icon based on current state
 */
export function updateTrayIcon(tray: Tray | null, isPreventingSleep: boolean) {
  if (!tray) return;
  
  try {
    const basePath = app.getAppPath(); 
    let iconPath;

    if (process.platform === 'win32') {
      const iconName = isPreventingSleep ? 'icon-active.ico' : 'icon-inactive.ico';
      
      if (app.isPackaged) {
        const possiblePaths = [
          path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', iconName),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon.ico'),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', iconName),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'public', 'icon.png')
        ];
        
        for (const testPath of possiblePaths) {
          if (fs.existsSync(testPath)) {
            iconPath = testPath;
            break;
          }
        }
      } else {
        // Development paths
        iconPath = path.join(basePath, 'build', 'icons', 'win', iconName);
        
        if (!fs.existsSync(iconPath)) {
          iconPath = path.join(basePath, 'build', 'icons', 'win', 'icon.ico');
          
          if (!fs.existsSync(iconPath)) {
            iconPath = path.join(basePath, 'public', 'icon.png');
          }
        }
      }
    } else {
      // For other platforms, use SVG
      const iconName = isPreventingSleep ? 'eye-active.svg' : 'eye-inactive.svg';
      
      if (app.isPackaged) {
        iconPath = path.join(path.dirname(app.getPath('exe')), 'resources', 'public', iconName);
      } else {
        iconPath = path.join(basePath, 'public', iconName);
      }
    }
    
    if (iconPath && fs.existsSync(iconPath)) {
      console.log(`Setting tray icon to: ${iconPath}`);
      
      if (process.platform === 'win32') {
        const buffer = fs.readFileSync(iconPath);
        const freshIcon = nativeImage.createFromBuffer(buffer);
        const resizedIcon = freshIcon.resize({ width: 16, height: 16 });
        tray.setImage(resizedIcon);
      } else {
        const trayIconImage = nativeImage.createFromPath(iconPath);
        tray.setImage(trayIconImage);
      }
    }
  } catch (error) {
    console.error('Failed to update tray icon:', error);
  }
}

/**
 * Update the window taskbar icon
 */
export function updateWindowIcon(mainWindow: BrowserWindow | null, isPreventingSleep: boolean) {
  if (!mainWindow || process.platform !== 'win32') return;
  
  try {
    const basePath = app.getAppPath();
    const iconName = isPreventingSleep ? 'icon-active.ico' : 'icon-inactive.ico';
    let iconPath;
    
    if (app.isPackaged) {
      const possiblePaths = [
        path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', iconName),
        path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', iconName),
        path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon.ico'),
        path.join(path.dirname(app.getPath('exe')), 'resources', 'public', 'icon.png')
      ];
      
      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          iconPath = testPath;
          break;
        }
      }
    } else {
      iconPath = path.join(basePath, 'build', 'icons', 'win', iconName);
      
      if (!fs.existsSync(iconPath)) {
        iconPath = path.join(basePath, 'build', 'icons', 'win', 'icon.ico');
        
        if (!fs.existsSync(iconPath)) {
          iconPath = path.join(basePath, 'public', 'icon.png');
        }
      }
    }
    
    if (iconPath && fs.existsSync(iconPath)) {
      console.log(`Setting window icon to: ${iconPath}`);
      const windowIcon = nativeImage.createFromPath(iconPath);
      mainWindow.setIcon(windowIcon);
      
      // Apply overlay icon for active state
      if (isPreventingSleep) {
        try {
          const overlayPath = iconPath.includes('active') ? iconPath : (
            iconPath.replace('inactive', 'active').replace('icon.ico', 'icon-active.ico')
          );
          
          if (fs.existsSync(overlayPath)) {
            const overlayIcon = nativeImage.createFromPath(overlayPath).resize({ width: 16, height: 16 });
            mainWindow.setOverlayIcon(overlayIcon, 'Sleep Prevention Active');
          }
        } catch (err) {
          console.error('Failed to set overlay icon:', err);
        }
      } else {
        mainWindow.setOverlayIcon(null, '');
      }
    }
  } catch (error) {
    console.error('Failed to update window icon:', error);
  }
}
