import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen, Notification } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { createTrayIcon, createAppIcon, updateAppIcons } from './icon-manager-improved';
import { fixWindowsTaskbarIcon } from './windows-taskbar-icon-fix-improved';
import { SleepPreventionManager, SleepPreventionMode } from './activity/SleepPreventionManager';
import { ActivitySimulatorFactory } from './activity/ActivitySimulatorFactory';
import { ActivitySimulator } from './activity/ActivitySimulator';
import { SettingsManager } from './SettingsManager';
// Import icon utilities
const { forceTaskbarIconUpdate } = require('./force-taskbar-icon-update');
const { ensureIconsAvailable } = require('./ensure-icons-available');
const { extractAndCopyIcons } = require('./extract-and-copy-icons');

// Setup live reload for development
if (process.env.NODE_ENV === 'development') {
  try {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      hardResetMethod: 'exit'
    });
    console.log('Electron reload enabled for development');
  } catch (err) {
    console.log('electron-reload not available, continuing without live reload');
  }
}

// Import platform-specific modules
import * as windowsImpl from './platforms/windows';
import * as macosImpl from './platforms/macos';
import * as linuxImpl from './platforms/linux';

// Keep a global reference of objects to prevent garbage collection
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isPreventingSleep = false;
let isAppQuitting = false; // Track app quitting state

// Activity simulation system
let sleepPreventionManager: SleepPreventionManager;
let activitySimulator: ActivitySimulator | null = null;
let settingsManager: SettingsManager;

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
    const currentMode = sleepPreventionManager.getState().mode;
    
    // Handle system sleep prevention
    if (sleepPreventionManager.shouldPreventSystemSleep(currentMode)) {
      await platformImpl.preventSleep();
      sleepPreventionManager.setSystemSleepPrevention(true);
    }
    
    // Handle activity simulation
    if (sleepPreventionManager.shouldSimulateActivity(currentMode)) {
      await startActivitySimulation();
    }
    
    isPreventingSleep = true;
    
    // Update both tray and taskbar icons
    updateAppIcons(mainWindow, tray, true);
    
    // Force Windows taskbar icon update
    if (process.platform === 'win32' && mainWindow) {
      // First apply the regular update
      const appIcon = createAppIcon(true);
      mainWindow.setIcon(appIcon);
      
      // Then force a taskbar refresh using multiple techniques
      setTimeout(async () => {
        await forceTaskbarIconUpdate(mainWindow, true);
      }, 100);
    }
    
    console.log(`Sleep prevention enabled on ${process.platform} (mode: ${currentMode})`);
  } catch (error) {
    console.error('Error preventing sleep:', error);
  }
};

const allowSleep = async () => {
  if (!isPreventingSleep) return;
  
  const platformImpl = getPlatformImpl();
  if (!platformImpl) return;
  
  try {
    // Stop activity simulation
    await stopActivitySimulation();
    
    // Handle system sleep prevention
    if (sleepPreventionManager.getState().systemSleepPrevention) {
      await platformImpl.allowSleep();
      sleepPreventionManager.setSystemSleepPrevention(false);
    }
    
    isPreventingSleep = false;
    
    // Update both tray and taskbar icons
    updateAppIcons(mainWindow, tray, false);
    
    // Force Windows taskbar icon update
    if (process.platform === 'win32' && mainWindow) {
      // First apply the regular update
      const appIcon = createAppIcon(false);
      mainWindow.setIcon(appIcon);
      
      // Then force a taskbar refresh using multiple techniques
      setTimeout(async () => {
        await forceTaskbarIconUpdate(mainWindow, false);
      }, 100);
    }
    
    console.log(`Sleep prevention disabled on ${process.platform}`);
  } catch (error) {
    console.error('Error allowing sleep:', error);
  }
};

/**
 * Creates a system tray icon with menu
 */
function createTray() {
  // Don't create a tray if it already exists
  if (tray !== null) return;
  
  console.log('Creating system tray icon...');
  
  try {
    // Find the icon file using a similar approach as the test script
    const possibleIcons = [
      path.join(app.getAppPath(), 'build', 'icons', 'win', isPreventingSleep ? 'eye-active.ico' : 'eye-inactive.ico'),
      path.join(app.getAppPath(), 'build', isPreventingSleep ? 'eye-active.ico' : 'eye-inactive.ico'),
      path.join(app.getAppPath(), 'app.ico'),
      path.join(app.getAppPath(), 'build', 'icon.ico'),
      path.join(app.getAppPath(), 'public', isPreventingSleep ? 'eye-active.svg' : 'eye-inactive.svg')
    ];
    
    // Find the first existing icon
    let iconPath = null;
    for (const p of possibleIcons) {
      try {
        if (fs.existsSync(p)) {
          iconPath = p;
          console.log(`Found tray icon at: ${iconPath}`);
          break;
        }
      } catch (err) {
        console.error(`Error checking icon path: ${p}`, err);
      }
    }
    
    // Create icon and tray
    let icon;
    if (iconPath) {
      icon = nativeImage.createFromPath(iconPath);
      console.log(`Created tray icon from: ${iconPath}`);
    } else {
      // Fallback to the icon manager
      icon = createTrayIcon(isPreventingSleep);
      console.log('Used icon manager to create tray icon');
    }
    
    // Create the tray with the icon
    tray = new Tray(icon);
    tray.setToolTip('NoDoze - Keep Your Computer Awake');
    
    console.log('System tray icon created successfully');
    
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
    
    // Log platform specific info to help with debugging
    console.log(`Platform: ${process.platform}`);
    console.log(`Electron version: ${process.versions.electron}`);
    
    // Help user find the tray icon in the notification area
    setTimeout(() => {
      if (mainWindow && process.platform === 'win32') {
        mainWindow.webContents.executeJavaScript(`
          if (!document.getElementById('tray-icon-alert')) {
            const alert = document.createElement('div');
            alert.id = 'tray-icon-alert';
            alert.style = 'position:fixed;bottom:20px;right:20px;background:#f0f7ff;border:1px solid #0078d4;padding:15px;border-radius:5px;box-shadow:0 2px 8px rgba(0,0,0,0.1);z-index:9999;';
            alert.innerHTML = '<h3 style="margin-top:0;color:#0078d4;">NoDoze Running in System Tray</h3><p>Look for the eye icon in your system tray (notification area).</p><p>Click on the up-arrow (^) in the taskbar if you don\'t see it.</p><button id="close-alert" style="padding:5px 10px;">Got it</button>';
            document.body.appendChild(alert);
            document.getElementById('close-alert').onclick = function() { document.getElementById('tray-icon-alert').style.display = 'none'; };
          }
        `).catch(err => console.error('Error showing tray notification:', err));
      }
    }, 2000);
    
    return true;
  } catch (error) {
    console.error('Failed to create system tray icon:', error);
    return false;
  }
}

/**
 * Updates the tray context menu with the current state
 */
function updateTrayMenu() {
  if (!tray) return;
  
  // Update both tray and app icons based on current state
  updateAppIcons(mainWindow, tray, isPreventingSleep);
  
  const state = sleepPreventionManager.getState();
  
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
      label: 'Sleep Prevention Mode',
      submenu: [
        {
          label: 'Basic (Sleep only)',
          type: 'radio',
          checked: state.mode === SleepPreventionMode.BASIC,
          click: async () => {
            await changeSleepPreventionMode(SleepPreventionMode.BASIC);
          }
        },
        {
          label: 'Full (Sleep + Activity)',
          type: 'radio',
          checked: state.mode === SleepPreventionMode.FULL,
          click: async () => {
            await changeSleepPreventionMode(SleepPreventionMode.FULL);
          }
        },
        {
          label: 'Activity Only',
          type: 'radio',
          checked: state.mode === SleepPreventionMode.ACTIVITY_ONLY,
          click: async () => {
            await changeSleepPreventionMode(SleepPreventionMode.ACTIVITY_ONLY);
          }
        },
        {
          type: 'separator'
        },
        {
          label: `Current: ${sleepPreventionManager.getModeDisplayName(state.mode)}`,
          enabled: false
        }
      ]
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
  console.log('Creating main window with improved icon management');
  
  // Get appropriate app icon using our improved icon manager with eye icons
  const appIcon = createAppIcon(isPreventingSleep);
  
  // Create the browser window with the icon
  mainWindow = new BrowserWindow({
    width: 380,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: appIcon, // Set the icon directly using our improved icon manager with eye icons
    frame: false, // Remove default window frame
    resizable: false,
    transparent: false,
    hasShadow: true,
  });
  
  // Set the title
  mainWindow.setTitle('NoDoze');
  
  // Apply Windows-specific taskbar icon fixes
  if (process.platform === 'win32') {
    // Direct approach for Windows taskbar icon
    try {
      // Try several icon paths in order of preference, prioritizing eye icons
      const iconPaths = [
        path.join(app.getAppPath(), 'app.ico'), // This should be eye-active.ico (copied by setup-eye-icons.js)
        path.join(app.getAppPath(), 'build', 'icons', 'win', 'eye-active.ico'),
        path.join(app.getAppPath(), 'build', 'icons', 'win', 'eye-inactive.ico'),
        path.join(app.getAppPath(), 'build', 'icons', 'win', 'icon.ico'),
        path.join(app.getAppPath(), 'public', 'icon.png')
      ];
      
      // Find the first icon that exists
      let foundIcon = null;
      for (const iconPath of iconPaths) {
        if (fs.existsSync(iconPath)) {
          console.log(`Found icon at: ${iconPath}`);
          foundIcon = iconPath;
          break;
        }
      }
      
      if (foundIcon) {
        const icon = nativeImage.createFromPath(foundIcon);
        if (!icon.isEmpty()) {
          mainWindow.setIcon(icon);
          console.log('Set Windows taskbar icon directly from file');
        }
      }
      
      // Set AppUserModelId for proper taskbar grouping
      app.setAppUserModelId('com.nodoze.app');
      
      // Also use our improved taskbar icon fix utility
      fixWindowsTaskbarIcon(mainWindow).then(success => {
        if (success) {
          console.log('Applied Windows taskbar icon fixes successfully');
        } else {
          console.warn('Windows taskbar icon fixes did not fully succeed');
        }
      });
    } catch (error) {
      console.error('Error setting direct Windows taskbar icon:', error);
    }
  }
  
  // Update both taskbar and tray icons based on current state
  updateAppIcons(mainWindow, tray, isPreventingSleep);
  
  console.log('Window title and icon set for NoDoze');
  
  // Load the index.html file
  const indexPath = app.isPackaged 
    ? path.join(__dirname, 'index.html')
    : path.join(__dirname, '../dist/index.html');
    
  console.log('Loading index.html from:', indexPath);
  
  // In development mode, use a file URL with query param to avoid caching
  if (process.env.NODE_ENV === 'development' && mainWindow) {
    const fileUrl = `file://${indexPath}?time=${new Date().getTime()}`;
    mainWindow.loadURL(fileUrl).then(() => {
      console.log('Successfully loaded index.html (dev mode)');
    }).catch((error: Error) => {
      console.error('Failed to load index.html (dev mode):', error);
      showErrorInWindow(error);
    });
  } else if (mainWindow) {
    mainWindow.loadFile(indexPath).then(() => {
      console.log('Successfully loaded index.html');
    }).catch((error: Error) => {
      console.error('Failed to load index.html:', error);
      showErrorInWindow(error);
    });
  }
  
  // Open DevTools for debugging in development mode
  if (!app.isPackaged && mainWindow) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    console.log('DevTools opened');
  }
  
  // Handle window close event - hide instead of close
  if (mainWindow) {
    mainWindow.on('close', (event: Electron.Event) => {
      if (!isAppQuitting) {
        event.preventDefault();
        mainWindow?.hide();
        return false;
      }
      return true;
    });
  }
}

/**
 * Initialize the sleep prevention system
 */
function initializeSleepPreventionSystem() {
  console.log('Initializing sleep prevention system...');
  
  // Initialize settings manager
  settingsManager = new SettingsManager();
  
  // Debug settings file
  debugSettingsFile();
  
  // Create sleep prevention manager with settings
  const config = settingsManager.getSleepPreventionConfig();
  sleepPreventionManager = new SleepPreventionManager(config);

  // Add state change listener
  sleepPreventionManager.addListener((state) => {
    console.log('Sleep prevention state changed:', state);
    
    // Save the current mode to settings
    settingsManager.setSleepPreventionMode(state.mode);
    
    // Notify renderer process
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('sleep-state-changed', state);
    }
    
    // Update tray menu
    updateTrayMenu();
  });

  console.log('Sleep prevention system initialized with saved settings');
}

/**
 * Debug utility to log settings file info
 */
function debugSettingsFile() {
  try {
    const settingsPath = settingsManager.getSettingsPath();
    console.log('=== DEBUG SETTINGS INFO ===');
    console.log(`Settings file location: ${settingsPath}`);
    
    if (fs.existsSync(settingsPath)) {
      const settingsContent = fs.readFileSync(settingsPath, 'utf8');
      console.log('Settings file content:');
      console.log(settingsContent);
      
      try {
        const parsedSettings = JSON.parse(settingsContent);
        console.log('Theme setting:', parsedSettings.ui?.theme || 'not set');
      } catch (parseError) {
        console.error('Error parsing settings file:', parseError);
      }
    } else {
      console.log('Settings file does not exist yet');
    }
    console.log('=========================');
  } catch (error) {
    console.error('Error debugging settings file:', error);
  }
}

/**
 * Start activity simulation
 */
async function startActivitySimulation(): Promise<void> {
  if (activitySimulator && activitySimulator.getStatus().isRunning) {
    console.log('[NoDoze] startActivitySimulation: Already running');
    return;
  }

  try {
    console.log('[NoDoze] startActivitySimulation: Creating or starting simulator');
    // Create activity simulator if it doesn't exist
    if (!activitySimulator) {
      const config = sleepPreventionManager.getConfig();
      console.log('[NoDoze] startActivitySimulation: Creating new ActivitySimulator with config', config);
      activitySimulator = ActivitySimulatorFactory.create({
        interval: config.activityInterval,
        activityType: config.activityType,
        debug: config.debug
      });
    }

    await activitySimulator.start();
    sleepPreventionManager.setActivitySimulation(true);
    
    console.log('[NoDoze] Activity simulation started');
  } catch (error) {
    console.error('[NoDoze] Error starting activity simulation:', error);
  }
}

/**
 * Stop activity simulation
 */
async function stopActivitySimulation(): Promise<void> {
  if (!activitySimulator || !activitySimulator.getStatus().isRunning) {
    return;
  }

  try {
    activitySimulator.stop();
    sleepPreventionManager.setActivitySimulation(false);
    
    console.log('Activity simulation stopped');
  } catch (error) {
    console.error('Error stopping activity simulation:', error);
  }
}

/**
 * Change sleep prevention mode
 */
async function changeSleepPreventionMode(mode: SleepPreventionMode): Promise<void> {
  const previousMode = sleepPreventionManager.getState().mode;
  if (previousMode === mode) {
    console.log(`[NoDoze] changeSleepPreventionMode: Mode unchanged (${mode})`);
    return;
  }

  console.log(`[NoDoze] Changing sleep prevention mode from ${previousMode} to ${mode}`);
  console.log(`[NoDoze] shouldSimulateActivity:`, sleepPreventionManager.shouldSimulateActivity(mode));
  console.log(`[NoDoze] shouldPreventSystemSleep:`, sleepPreventionManager.shouldPreventSystemSleep(mode));

  // Always allow sleep and stop simulation before changing mode
  if (isPreventingSleep) {
    await allowSleep();
  }
  sleepPreventionManager.setMode(mode);

  // After changing mode, start activity simulation if needed
  if (sleepPreventionManager.shouldSimulateActivity(mode)) {
    console.log('[NoDoze] changeSleepPreventionMode: Starting activity simulation');
    await startActivitySimulation();
  }
  // If the new mode also prevents system sleep, start that as well
  if (sleepPreventionManager.shouldPreventSystemSleep(mode)) {
    console.log('[NoDoze] changeSleepPreventionMode: Preventing system sleep');
    await preventSleep();
  }
}

/**
 * Get activity simulator capabilities
 */
async function getActivitySimulatorCapabilities() {
  try {
    const capabilities = await ActivitySimulatorFactory.getPlatformCapabilities();
    return capabilities;
  } catch (error) {
    console.error('Error getting activity simulator capabilities:', error);
    return null;
  }
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

/**
 * Helper function to show errors in the window
 */
function showErrorInWindow(error: Error) {
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      document.body.innerHTML = '<div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2>Failed to load application</h2>
        <p>${error.toString()}</p>
        <p>Please check the console for more details.</p>
      </div>';
    `);
  }
}

// Helper function to debug icon paths and errors
function debugIconPath(iconPath: string) {
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

/**
 * Show a notification to help users find the tray icon
 */
function showTrayIconNotification() {
  if (process.platform === 'win32' && mainWindow) {
    try {
      const notification = new Notification({
        title: 'NoDoze System Tray Icon',
        body: 'NoDoze is running in the system tray. Look for the eye icon in the notification area.',
        icon: createAppIcon(isPreventingSleep)
      });
      
      notification.show();
      console.log('Showed notification about tray icon location');
      
      // When clicked, show the main window
      notification.on('click', () => {
        if (mainWindow) {
          mainWindow.show();
        }
      });
    } catch (err) {
      console.error('Failed to show tray icon notification:', err);
    }
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  // Extract icons from asar and copy them to accessible locations (production only)
  await extractAndCopyIcons();
  
  // Ensure icon files are available in production environment
  await ensureIconsAvailable();
  
  initializePlatform();
  createWindow();
  createTray();
  
  // Show notification to help users find the tray icon
  setTimeout(() => {
    showTrayIconNotification();
  }, 2000);
  
  // Apply our special Windows taskbar icon fix
  if (process.platform === 'win32' && mainWindow) {
    // Ensure icons are ready
    if (app.isPackaged) {
      console.log('Production build detected - applying extra icon setup for Windows');
      
      // Wait longer in production to ensure icons are properly extracted
      setTimeout(async () => {
        // Apply both icon utilities
        await extractAndCopyIcons();
        await ensureIconsAvailable();
        
        // Force icon update with aggressive techniques
        await forceTaskbarIconUpdate(mainWindow, isPreventingSleep);
      }, 1000);
    }
    
    fixWindowsTaskbarIcon(mainWindow);
    console.log('Applied Windows-specific taskbar icon fix');
  }

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

// Handle window control events
ipcMain.on('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('window-corner', () => {
  if (mainWindow) {
    try {
      // Get display where the window is currently located
      const windowBounds = mainWindow.getBounds();
      const currentDisplay = screen.getDisplayNearestPoint({ 
        x: windowBounds.x + windowBounds.width / 2, 
        y: windowBounds.y + windowBounds.height / 2
      });
      
      // Get the work area (screen size minus taskbar/dock)
      const { workArea } = currentDisplay;
      const windowSize = mainWindow.getSize();
      
      // Calculate position to place window in lower right corner with a small margin
      const margin = 20;
      const xPosition = workArea.x + workArea.width - windowSize[0] - margin;
      const yPosition = workArea.y + workArea.height - windowSize[1] - margin;
      
      // Store current position for potential future toggle
      // (We don't use this yet, but could be useful for adding a toggle feature later)
      const currentPosition = mainWindow.getPosition();
      
      // Ensure the window is visible and not minimized
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      
      // Move the window to the lower right corner with animated effect
      // by moving it in small increments
      const animateWindow = (fromX: number, fromY: number, toX: number, toY: number, steps: number = 15) => {
        const stepX = (toX - fromX) / steps;
        const stepY = (toY - fromY) / steps;
        let currentStep = 0;
        
        const moveStep = () => {
          if (currentStep <= steps && mainWindow) {
            const nextX = Math.round(fromX + stepX * currentStep);
            const nextY = Math.round(fromY + stepY * currentStep);
            mainWindow.setPosition(nextX, nextY, true);
            currentStep++;
            setTimeout(moveStep, 10);
          }
        };
        
        moveStep();
      };
      
      const [currentX, currentY] = mainWindow.getPosition();
      animateWindow(currentX, currentY, xPosition, yPosition);
      
      console.log(`Moving window to corner position: (${xPosition}, ${yPosition})`);
    } catch (error) {
      console.error('Error moving window to corner:', error);
      
      // Fallback to simpler positioning if the animated approach fails
      try {
        const { workAreaSize } = screen.getPrimaryDisplay();
        const windowSize = mainWindow.getSize();
        mainWindow.setPosition(
          workAreaSize.width - windowSize[0] - 10,
          workAreaSize.height - windowSize[1] - 10
        );
      } catch (fallbackError) {
        console.error('Fallback positioning also failed:', fallbackError);
      }
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) {
    // Don't actually quit the app, just hide the window
    mainWindow.hide();
  }
});

// Clean up before quitting
app.on('before-quit', async () => {
  // Mark the app as quitting to allow window close
  isAppQuitting = true;
  
  await allowSleep();
  
  // Stop activity simulation
  if (activitySimulator) {
    try {
      activitySimulator.stop();
    } catch (error) {
      console.error('Error stopping activity simulation:', error);
    }
  }
  
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

// Initialize the sleep prevention system
initializeSleepPreventionSystem();
debugSettingsFile();

// Handle sleep prevention mode changes
ipcMain.handle('set-sleep-prevention-mode', async (event, mode: SleepPreventionMode) => {
  try {
    await changeSleepPreventionMode(mode);
    return { success: true };
  } catch (error) {
    console.error('Error setting sleep prevention mode:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('get-sleep-prevention-state', () => {
  return sleepPreventionManager.getState();
});

ipcMain.handle('get-activity-simulator-capabilities', async () => {
  return await getActivitySimulatorCapabilities();
});

// Handle activity simulation controls
ipcMain.handle('start-activity-simulation', async () => {
  try {
    await startActivitySimulation();
    return { success: true };
  } catch (error) {
    console.error('Error starting activity simulation:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('stop-activity-simulation', async () => {
  try {
    await stopActivitySimulation();
    return { success: true };
  } catch (error) {
    console.error('Error stopping activity simulation:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Handle configuration updates
ipcMain.handle('update-sleep-prevention-config', async (event, config) => {
  try {
    sleepPreventionManager.updateConfig(config);
    
    // If activity simulator is running, update its configuration
    if (activitySimulator && activitySimulator.getStatus().isRunning) {
      activitySimulator.setInterval(config.activityInterval || 30000);
      activitySimulator.setActivityType(config.activityType || 'both');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating sleep prevention config:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Handle settings management
ipcMain.handle('get-settings', () => {
  return settingsManager.getSettings();
});

ipcMain.handle('update-settings', async (event, settings) => {
  try {
    // Update specific settings
    if (settings.sleepPreventionMode) {
      settingsManager.setSleepPreventionMode(settings.sleepPreventionMode);
    }
    
    if (settings.activitySimulation) {
      settingsManager.setActivitySimulationSettings(settings.activitySimulation);
    }
    
    if (settings.ui) {
      settingsManager.setUISettings(settings.ui);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('reset-settings', () => {
  try {
    settingsManager.resetSettings();
    return { success: true };
  } catch (error) {
    console.error('Error resetting settings:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('export-settings', () => {
  return settingsManager.exportSettings();
});

ipcMain.handle('import-settings', (event, jsonString) => {
  try {
    const success = settingsManager.importSettings(jsonString);
    return { success };
  } catch (error) {
    console.error('Error importing settings:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Handle theme preference operations
ipcMain.handle('get-theme-preference', () => {
  console.log('Main: get-theme-preference IPC handler called');
  try {
    const theme = settingsManager.getTheme();
    console.log(`Main: Current theme preference: ${theme}`);
    return theme;
  } catch (error) {
    console.error('Main: Error getting theme preference:', error);
    return 'light'; // Default to light theme on error
  }
});

ipcMain.handle('set-theme-preference', (_, theme: 'light' | 'dark') => {
  console.log(`Main: set-theme-preference IPC handler called with theme: ${theme}`);
  try {
    settingsManager.setTheme(theme);
    console.log(`Main: Theme preference set to: ${theme}`);
    return { success: true };
  } catch (error) {
    console.error('Main: Error setting theme preference:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
});

// Application icon state management
// Note: In production builds, the taskbar icon may not update correctly despite our efforts
// This is a known limitation due to Windows' aggressive icon caching and Electron packaging
// The system tray icon works reliably and serves as the primary visual indicator of app state
