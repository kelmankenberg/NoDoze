import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron';
import * as path from 'path';

// Import platform-specific modules
import * as windowsImpl from './platforms/windows';
import * as macosImpl from './platforms/macos';
import * as linuxImpl from './platforms/linux';

// Keep a global reference of objects to prevent garbage collection
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isPreventingSleep = false;
let isAppQuitting = false; // Track app quitting state

// Get the appropriate platform implementation
const getPlatformImpl = () => {
  switch (process.platform) {
    case 'win32':
      return windowsImpl;
    case 'darwin':
      return macosImpl;
    case 'linux':
      return linuxImpl;
    default:
      console.error(`Unsupported platform: ${process.platform}`);
      return null;
  }
};

// Platform-specific sleep prevention
const preventSleep = async () => {
  if (isPreventingSleep) return;
  
  const platformImpl = getPlatformImpl();
  if (!platformImpl) {
    console.error('No platform implementation available');
    return;
  }
  
  try {
    await platformImpl.preventSleep();
    isPreventingSleep = true;
    console.log(`Sleep prevention enabled on ${process.platform}`);
  } catch (error) {
    console.error('Error preventing sleep:', error);
  }
};

const allowSleep = async () => {
  if (!isPreventingSleep) return;
  
  const platformImpl = getPlatformImpl();
  if (!platformImpl) return;
  
  try {
    await platformImpl.allowSleep();
    console.log(`Sleep prevention disabled on ${process.platform}`);
  } catch (error) {
    console.error('Error allowing sleep:', error);
  }
  
  isPreventingSleep = false;
};

/**
 * Creates a proper icon for the tray based on the platform and active state
 */
function createTrayIcon(active: boolean = false) {
  let iconName = active ? 'icon-active.svg' : 'icon-inactive.svg';
  
  // Determine the correct path to the icon based on whether the app is packaged
  const iconPath = path.join(
    app.isPackaged 
      ? path.dirname(app.getPath('exe')) 
      : path.join(__dirname, '..'),
    'public', 
    iconName
  );
  
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
    
    // Try using the default icon as fallback
    try {
      const fallbackPath = path.join(
        app.isPackaged 
          ? path.dirname(app.getPath('exe')) 
          : path.join(__dirname, '..'),
        'public', 
        'icon.svg'
      );
      return nativeImage.createFromPath(fallbackPath);
    } catch (fallbackError) {
      // Return a small empty image as last resort fallback
      return nativeImage.createEmpty();
    }
  }
}

/**
 * Creates a system tray icon with menu
 */
function createTray() {
  // Don't create a tray if it already exists
  if (tray !== null) return;
  
  // Create the tray icon
  const icon = createTrayIcon(isPreventingSleep);
  tray = new Tray(icon);
  tray.setToolTip('NoDoze - Keep Your Computer Awake');
  
  // Update the context menu
  updateTrayMenu();
  
  // Show/hide window on tray click
  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
    }
  });
}

/**
 * Updates the tray context menu with the current state
 */
function updateTrayMenu() {
  if (!tray) return;
  
  // Update the icon based on the current sleep prevention state
  const trayIcon = createTrayIcon(isPreventingSleep);
  tray.setImage(trayIcon);
  
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
  
  tray.setContextMenu(contextMenu);
  
  // Update tray tooltip based on sleep prevention state
  tray.setToolTip(`NoDoze - ${isPreventingSleep ? 'Sleep Prevention Active' : 'Idle'}`);
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 380,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(
      app.isPackaged ? path.dirname(app.getPath('exe')) : path.join(__dirname, '..'),
      'public', 'icon.png'
    ),
    resizable: false,
  });

  // Set the title
  mainWindow.setTitle('NoDoze');
  console.log('Window title set to NoDoze');

  // Load the index.html file
  const indexPath = app.isPackaged 
    ? path.join(__dirname, 'index.html')
    : path.join(__dirname, '../dist/index.html');
    
  console.log('Loading index.html from:', indexPath);
  
  mainWindow.loadFile(indexPath).then(() => {
    console.log('Successfully loaded index.html');
  }).catch(error => {
    console.error('Failed to load index.html:', error);
    // Try to show an error message to the user
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(`
        document.body.innerHTML = '<div style="padding: 20px; font-family: Arial, sans-serif;">
          <h2>Failed to load application</h2>
          <p>${error.toString()}</p>
          <p>Please check the console for more details.</p>
        </div>';
      `);
    }
  });

  // Open DevTools for debugging in development mode
  // if (!app.isPackaged) {
  //   mainWindow.webContents.openDevTools({ mode: 'detach' });
  // }
  
  // Handle window close event - hide instead of close
  mainWindow.on('close', (event) => {
    if (!isAppQuitting) {
      event.preventDefault();
      mainWindow?.hide();
      return false;
    }
    return true;
  });
}

// Initialize platform-specific implementations
const initializePlatform = () => {
  const platformImpl = getPlatformImpl();
  if (platformImpl) {
    try {
      platformImpl.initialize();
      console.log(`Platform ${process.platform} initialized`);
    } catch (error) {
      console.error('Error initializing platform:', error);
    }
  }
};

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  initializePlatform();
  createWindow();
  createTray();

  app.on('activate', function () {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for renderer process communication
ipcMain.on('toggle-sleep-prevention', async (_, shouldPrevent) => {
  if (shouldPrevent) {
    await preventSleep();
  } else {
    await allowSleep();
  }
  
  // Update the tray menu with the new state
  updateTrayMenu();
  
  // Notify renderer of status change
  mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
});

ipcMain.handle('get-sleep-status', () => {
  return isPreventingSleep;
});

// Clean up before quitting
app.on('before-quit', async () => {
  // Mark the app as quitting to allow window close
  isAppQuitting = true;
  
  await allowSleep();
  
  // Clean up platform-specific resources
  const platformImpl = getPlatformImpl();
  if (platformImpl && platformImpl.cleanup) {
    try {
      await platformImpl.cleanup();
    } catch (error) {
      console.error('Error during platform cleanup:', error);
    }
  }
  
  // Destroy the tray icon
  if (tray) {
    tray.destroy();
    tray = null;
  }
});