// Fix TypeScript errors in index.ts
const fs = require('fs');
const path = require('path');

console.log('Fixing TypeScript errors in index.ts...');

// Read the current content of index.ts
const indexPath = path.join(__dirname, 'src', 'main', 'index.ts');
let content = fs.readFileSync(indexPath, 'utf-8');

// 1. Fix updateTrayMenu function that has TypeScript errors
const newUpdateTrayMenuFunc = `
/**
 * Updates the tray context menu with the current state
 */
function updateTrayMenu() {
  if (!tray) return;
  
  console.log(\`Updating tray menu and icons (active=\${isPreventingSleep})\`);
  
  try {
    // Update the icon based on current state
    const basePath = app.getAppPath();
    let iconPath = '';
    
    if (process.platform === 'win32') {
      // Use .ico files from win folder with absolute paths
      const iconName = isPreventingSleep ? 'icon-active.ico' : 'icon-inactive.ico';
      
      // Handle packaged vs development paths
      if (app.isPackaged) {
        // In packaged app, check these locations in order
        const possiblePaths = [
          path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', iconName),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon.ico'),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', iconName),
          path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', 'icon.ico')
        ];
        
        // Use the first path that exists
        for (const testPath of possiblePaths) {
          if (fs.existsSync(testPath)) {
            iconPath = testPath;
            break;
          }
        }
        
        // If no icon found, default to PNG
        if (!iconPath) {
          iconPath = path.join(path.dirname(app.getPath('exe')), 'resources', 'public', 'icon.png');
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
    
    if (fs.existsSync(iconPath)) {
      console.log(\`Setting tray icon to: \${iconPath}\`);
      
      // For Windows, read the file directly to avoid caching
      if (process.platform === 'win32' && tray) {
        const buffer = fs.readFileSync(iconPath);
        const freshIcon = nativeImage.createFromBuffer(buffer);
        const resizedIcon = freshIcon.resize({ width: 16, height: 16 });
        tray.setImage(resizedIcon);
      } else if (tray) {
        const trayIconImage = nativeImage.createFromPath(iconPath);
        tray.setImage(trayIconImage);
      }
    }
    
    // Also update the window icon
    if (mainWindow && process.platform === 'win32') {
      // For taskbar icon - use absolute paths
      const taskbarIconName = isPreventingSleep ? 'icon-active.ico' : 'icon-inactive.ico';
      let taskbarIconPath;
      
      if (app.isPackaged) {
        taskbarIconPath = path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', taskbarIconName);
        
        if (!fs.existsSync(taskbarIconPath)) {
          taskbarIconPath = path.join(path.dirname(app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon.ico');
        }
      } else {
        taskbarIconPath = path.join(basePath, 'build', 'icons', 'win', taskbarIconName);
        
        if (!fs.existsSync(taskbarIconPath)) {
          taskbarIconPath = path.join(basePath, 'build', 'icons', 'win', 'icon.ico');
        }
      }
      
      if (fs.existsSync(taskbarIconPath)) {
        console.log(\`Updating taskbar icon to: \${taskbarIconPath}\`);
        const windowIcon = nativeImage.createFromPath(taskbarIconPath);
        mainWindow.setIcon(windowIcon);
        
        // Apply overlay icon for active state (useful visual indicator)
        if (isPreventingSleep) {
          // Use a small overlay with green indicator
          try {
            const overlayPath = path.join(path.dirname(taskbarIconPath), 'icon-active.ico');
            if (fs.existsSync(overlayPath)) {
              const overlayIcon = nativeImage.createFromPath(overlayPath).resize({ width: 16, height: 16 });
              mainWindow.setOverlayIcon(overlayIcon, 'Sleep Prevention Active');
            }
          } catch (err) {
            console.error('Failed to set overlay icon:', err);
          }
        } else {
          // Clear overlay when inactive
          mainWindow.setOverlayIcon(null, '');
        }
      } else {
        console.warn(\`Taskbar icon not found at: \${taskbarIconPath}\`);
        // Try using PNG as fallback
        const pngPath = app.isPackaged
          ? path.join(path.dirname(app.getPath('exe')), 'resources', 'public', 'icon.png')
          : path.join(basePath, 'public', 'icon.png');
        
        if (fs.existsSync(pngPath)) {
          console.log(\`Using PNG fallback for taskbar: \${pngPath}\`);
          mainWindow.setIcon(nativeImage.createFromPath(pngPath));
        }
      }
    }
  } catch (error) {
    console.error('Failed to update tray icon:', error);
  }
  
  // Create the context menu
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Open NoDoze', 
      click: () => { mainWindow?.show(); }
    },
    { 
      type: 'separator' 
    },
    { 
      label: 'Prevent Sleep', 
      type: 'checkbox',
      checked: isPreventingSleep,
      click: async (menuItem) => {
        if (menuItem.checked) {
          await preventSleep();
        } else {
          await allowSleep();
        }
        updateTrayMenu();
        mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
      }
    },
    { 
      type: 'separator' 
    },
    {
      label: 'Quick Timer',
      submenu: [
        {
          label: '15 Minutes',
          click: async () => {
            await preventSleep();
            updateTrayMenu();
            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            mainWindow?.webContents.send('set-quick-timer', 15);
            
            // Set a timeout to disable sleep prevention
            setTimeout(async () => {
              await allowSleep();
              updateTrayMenu();
              mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            }, 15 * 60 * 1000);
          }
        },
        {
          label: '30 Minutes',
          click: async () => {
            await preventSleep();
            updateTrayMenu();
            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            mainWindow?.webContents.send('set-quick-timer', 30);
            
            setTimeout(async () => {
              await allowSleep();
              updateTrayMenu();
              mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            }, 30 * 60 * 1000);
          }
        },
        {
          label: '1 Hour',
          click: async () => {
            await preventSleep();
            updateTrayMenu();
            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            mainWindow?.webContents.send('set-quick-timer', 60);
            
            setTimeout(async () => {
              await allowSleep();
              updateTrayMenu();
              mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            }, 60 * 60 * 1000);
          }
        },
        {
          label: '2 Hours',
          click: async () => {
            await preventSleep();
            updateTrayMenu();
            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            mainWindow?.webContents.send('set-quick-timer', 120);
            
            setTimeout(async () => {
              await allowSleep();
              updateTrayMenu();
              mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            }, 120 * 60 * 1000);
          }
        }
      ]
    },
    { 
      type: 'separator' 
    },
    {
      label: 'Launch at Startup',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: (menuItem) => {
        app.setLoginItemSettings({
          openAtLogin: menuItem.checked,
          openAsHidden: menuItem.checked // Start minimized in tray
        });
      }
    },
    { 
      type: 'separator' 
    },
    { 
      label: 'Quit', 
      click: async () => { 
        await allowSleep();
        app.quit(); 
      }
    }
  ]);
  
  if (tray) {
    tray.setContextMenu(contextMenu);
    tray.setToolTip(\`NoDoze - \${isPreventingSleep ? 'Sleep Prevention Active' : 'Idle'}\`);
  }
}`;

// Find the updateTrayMenu function in the file and replace it
const functionRegex = /function updateTrayMenu\(\) {[\s\S]*?}/;
if (functionRegex.test(content)) {
  content = content.replace(functionRegex, newUpdateTrayMenuFunc);
  console.log('Updated updateTrayMenu function');
} else {
  console.log('Could not find updateTrayMenu function to replace');
}

// Save the changes
fs.writeFileSync(indexPath, content, 'utf8');
console.log('TypeScript errors fixed!');

// Run webpack to make sure it compiles
console.log('Running webpack to verify fixes...');
try {
  require('child_process').execSync('npm run webpack', { stdio: 'inherit' });
  console.log('Webpack build successful!');
} catch (err) {
  console.error('Error running webpack:', err);
}
