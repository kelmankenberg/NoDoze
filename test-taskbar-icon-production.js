/**
 * Test Taskbar Icon Production Build
 * 
 * This test script simulates the packaged app environment
 * and tests whether taskbar icon updates correctly in production.
 */

const { app, BrowserWindow, Tray } = require('electron');
const path = require('path');
const fs = require('fs');

// Mock the app.isPackaged property to test production mode
Object.defineProperty(app, 'isPackaged', {
  get() { return true }
});

// Import icon utilities
const { extractAndCopyIcons } = require('./src/main/extract-and-copy-icons');
const { ensureIconsAvailable } = require('./src/main/ensure-icons-available');
const { forceTaskbarIconUpdate } = require('./src/main/force-taskbar-icon-update');

// Global variables
let win = null;
let tray = null;
let iconActive = false;
let toggleInterval = null;

/**
 * Initialize the test window
 */
function createWindow() {
  console.log('Creating test window with production simulation...');
  
  // Extract and prepare icons for production testing
  console.log('Extracting and preparing icons...');
  extractAndCopyIcons().then(() => {
    ensureIconsAvailable().then(() => {
      console.log('Icons prepared for production testing');
      
      // Find appropriate icons
      const exeDir = path.dirname(process.execPath);
      
      let activeIconPath = path.join(exeDir, 'eye-active.ico');
      if (!fs.existsSync(activeIconPath)) {
        activeIconPath = path.join(exeDir, 'app.ico');
      }
      
      let inactiveIconPath = path.join(exeDir, 'eye-inactive.ico');
      if (!fs.existsSync(inactiveIconPath)) {
        inactiveIconPath = activeIconPath;
      }
      
      console.log(`Using active icon: ${activeIconPath}`);
      console.log(`Using inactive icon: ${inactiveIconPath}`);
      
      // Create window with initial icon
      win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: inactiveIconPath,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });
      
      // Set window properties
      win.setTitle('NoDoze Taskbar Icon Production Test');
      
      // Create a tray icon
      tray = new Tray(inactiveIconPath);
      tray.setToolTip('NoDoze Taskbar Icon Test');
      
      // Display basic info in the window
      win.loadURL(`data:text/html,
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              h1 { color: #2c3e50; }
              .status { font-weight: bold; margin: 20px 0; }
              .active { color: green; }
              .inactive { color: red; }
              .instructions { margin-top: 30px; padding: 10px; background: #f8f9fa; border-left: 4px solid #007bff; }
            </style>
          </head>
          <body>
            <h1>NoDoze Taskbar Icon Production Test</h1>
            <div class="status">Current Status: <span id="status" class="inactive">INACTIVE</span></div>
            <div class="instructions">
              <p><b>Testing Instructions:</b></p>
              <p>This test will automatically toggle between active/inactive states every 5 seconds.</p>
              <p>Watch the taskbar icon and verify that it changes between states.</p>
              <p>The tray icon (system tray) should also change.</p>
            </div>
          </body>
        </html>
      `);
      
      // Create toggle interval
      toggleInterval = setInterval(() => {
        toggleIconState();
      }, 5000);
      
      // Clean up on window close
      win.on('closed', () => {
        if (toggleInterval) {
          clearInterval(toggleInterval);
        }
        win = null;
      });
    });
  });
}

/**
 * Toggle icon state between active and inactive
 */
async function toggleIconState() {
  iconActive = !iconActive;
  console.log(`\n--- Toggling to ${iconActive ? 'ACTIVE' : 'INACTIVE'} state ---`);
  
  if (!win) return;
  
  try {
    // Update window content to show current state
    win.webContents.executeJavaScript(`
      document.getElementById('status').innerText = '${iconActive ? 'ACTIVE' : 'INACTIVE'}';
      document.getElementById('status').className = '${iconActive ? 'active' : 'inactive'}';
    `);
    
    // Find appropriate icons
    const exeDir = path.dirname(process.execPath);
    
    let iconPath = iconActive 
      ? path.join(exeDir, 'eye-active.ico')
      : path.join(exeDir, 'eye-inactive.ico');
    
    // Fallback to app.ico if icon not found
    if (!fs.existsSync(iconPath)) {
      iconPath = path.join(exeDir, 'app.ico');
      console.log(`Icon not found, using fallback: ${iconPath}`);
    }
    
    console.log(`Setting window icon to: ${iconPath}`);
    
    // Update window icon
    if (fs.existsSync(iconPath)) {
      win.setIcon(iconPath);
    } else {
      console.error(`Icon file not found: ${iconPath}`);
    }
    
    // Update tray icon
    if (tray) {
      tray.setImage(iconPath);
      tray.setToolTip(`NoDoze - ${iconActive ? 'Sleep Prevention Active' : 'Sleep Prevention Inactive'}`);
    }
    
    // Force taskbar icon update
    console.log('Forcing taskbar icon update...');
    await forceTaskbarIconUpdate(win, iconActive);
    
    console.log(`Icon state toggled to: ${iconActive ? 'ACTIVE' : 'INACTIVE'}`);
  } catch (error) {
    console.error('Error toggling icon state:', error);
  }
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
