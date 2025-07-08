/**
 * JavaScript version of icon-manager-improved for testing purposes
 * This is a simplified version that works with CommonJS require()
 */

const { app, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

// Icon file preferences by platform and state
const iconFiles = {
  active: {
    win32: {
      tray: ['eye-active.ico', 'eye-active.svg', 'icon.png'],
      app: ['eye-active.ico', 'eye-active.svg', 'icon.png'],
      overlay: ['eye-active.ico', 'eye-active.svg']
    },
    darwin: {
      tray: ['icon-active.svg', 'icon-active.png', 'icon.png'],
      app: ['icon-active.svg', 'icon-active.png', 'icon.png'],
      overlay: ['icon-active.svg', 'icon-active.png']
    },
    linux: {
      tray: ['icon-active.svg', 'icon-active.png', 'icon.png'],
      app: ['icon-active.svg', 'icon-active.png', 'icon.png'],
      overlay: ['icon-active.svg', 'icon-active.png']
    }
  },
  inactive: {
    win32: {
      tray: ['eye-inactive.ico', 'eye-inactive.svg', 'icon.png'],
      app: ['eye-inactive.ico', 'eye-inactive.svg', 'icon.png'],
      overlay: ['eye-inactive.ico', 'eye-inactive.svg']
    },
    darwin: {
      tray: ['icon-inactive.svg', 'icon-inactive.png', 'icon.png'],
      app: ['icon-inactive.svg', 'icon-inactive.png', 'icon.png'],
      overlay: ['icon-inactive.svg', 'icon-inactive.png']
    },
    linux: {
      tray: ['icon-inactive.svg', 'icon-inactive.png', 'icon.png'],
      app: ['icon-inactive.svg', 'icon-inactive.png', 'icon.png'],
      overlay: ['icon-inactive.svg', 'icon-inactive.png']
    }
  }
};

// Paths to look for icons
const iconPaths = [
  // Development paths
  path.join(app.getAppPath(), 'build', 'icons', '{{platform}}'),
  path.join(app.getAppPath(), 'build'),
  path.join(app.getAppPath(), 'public'),
  app.getAppPath(),
  
  // Production paths
  path.join(process.resourcesPath, 'build', 'icons', '{{platform}}'),
  path.join(process.resourcesPath, 'build'),
  path.join(process.resourcesPath, 'app.asar.unpacked', 'build', 'icons', '{{platform}}'),
  path.join(process.resourcesPath, 'app.asar.unpacked', 'build'),
  path.join(process.resourcesPath, 'app.asar.unpacked', 'public'),
  path.join(process.resourcesPath)
];

/**
 * Find the first existing file from a list of possible files
 */
function findExistingFile(basePath, fileNames) {
  for (const fileName of fileNames) {
    const filePath = path.join(basePath, fileName);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

/**
 * Load an icon from the filesystem with proper fallback
 */
function loadIcon(state, type) {
  const platform = process.platform;
  const platformStr = platform === 'win32' ? 'win' : platform === 'darwin' ? 'mac' : 'linux';
  
  // Get file preferences for this platform, state, and type
  const fileNames = iconFiles[state][platform][type];
  
  // Try each path in order
  for (const basePath of iconPaths) {
    const actualPath = basePath.replace('{{platform}}', platformStr);
    const filePath = findExistingFile(actualPath, fileNames);
    
    if (filePath) {
      console.log(`Found icon at: ${filePath}`);
      return nativeImage.createFromPath(filePath);
    }
  }
  
  // No icon found, return empty image
  console.warn(`No ${state} ${type} icon found for platform ${platform}, using empty icon`);
  return nativeImage.createEmpty();
}

/**
 * Create a tray icon based on active state
 */
function createTrayIcon(active) {
  console.log(`Creating ${active ? 'active' : 'inactive'} tray icon`);
  return loadIcon(active ? 'active' : 'inactive', 'tray');
}

/**
 * Create an app icon for the window based on active state
 */
function createAppIcon(active) {
  console.log(`Creating ${active ? 'active' : 'inactive'} app icon`);
  return loadIcon(active ? 'active' : 'inactive', 'app');
}

/**
 * Update both app and tray icons based on active state
 */
function updateAppIcons(window, tray, active) {
  if (!window || !tray) {
    console.warn('Cannot update icons: window or tray is null');
    return;
  }

  // Create icons
  const trayIcon = createTrayIcon(active);
  const appIcon = createAppIcon(active);
  
  // Update tray icon
  tray.setImage(trayIcon);
  
  // Update window icon
  window.setIcon(appIcon);
  
  // On Windows, clear any overlay icon and only use the main icon
  if (process.platform === 'win32') {
    window.setOverlayIcon(null, '');
  }
  
  console.log(`Icons updated to ${active ? 'active' : 'inactive'} state`);
}

module.exports = {
  createTrayIcon,
  createAppIcon,
  updateAppIcons
};
