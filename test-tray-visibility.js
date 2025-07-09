/**
 * Test Tray Icon Visibility
 * 
 * This script tests whether a system tray icon can be created and displayed.
 */

const { app, Tray, nativeImage, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let tray = null;
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  win.loadURL(`data:text/html,
    <html>
      <head>
        <title>Tray Icon Test</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { color: #333; }
          .info { background: #f0f0f0; padding: 15px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Tray Icon Visibility Test</h1>
        <p>This app is testing whether the system tray icon is visible.</p>
        <p>You should see an icon in your system tray (notification area).</p>
        <div class="info">
          <h3>Debug Information:</h3>
          <div id="debug-info"></div>
        </div>
      </body>
    </html>
  `);
}

function findIconFile() {
  const possibleIcons = [
    path.join(__dirname, 'build', 'icons', 'win', 'eye-active.ico'),
    path.join(__dirname, 'build', 'eye-active.ico'),
    path.join(__dirname, 'app.ico'),
    path.join(__dirname, 'build', 'icon.ico'),
    path.join(__dirname, 'public', 'icon.png')
  ];
  
  for (const iconPath of possibleIcons) {
    try {
      if (fs.existsSync(iconPath)) {
        console.log(`Found icon at: ${iconPath}`);
        return iconPath;
      }
    } catch (err) {
      console.error(`Error checking icon path: ${iconPath}`, err);
    }
  }
  
  console.warn('No icon file found, using default empty icon');
  return null;
}

function createTray() {
  try {
    const iconPath = findIconFile();
    let icon;
    
    if (iconPath) {
      icon = nativeImage.createFromPath(iconPath);
      console.log(`Created icon from: ${iconPath}`);
    } else {
      // Create a basic icon as fallback
      icon = nativeImage.createEmpty();
      const size = { width: 16, height: 16 };
      icon = icon.resize(size);
      console.log('Created empty icon as fallback');
    }
    
    // Create the tray
    tray = new Tray(icon);
    
    // Set tooltip and menu
    tray.setToolTip('Tray Icon Visibility Test');
    
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show App', click: () => { win.show(); } },
      { type: 'separator' },
      { label: 'Exit', click: () => { app.quit(); } }
    ]);
    
    tray.setContextMenu(contextMenu);
    
    console.log('Tray icon created successfully');
    
    // Log platform specific info
    console.log(`Platform: ${process.platform}`);
    console.log(`Electron version: ${process.versions.electron}`);
    
    // Check if tray is created
    setTimeout(() => {
      if (tray) {
        console.log('Tray reference exists after 1 second');
      } else {
        console.log('Tray reference is null after 1 second');
      }
    }, 1000);
    
    // Set up click handler to toggle visibility
    tray.on('click', () => {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error creating tray:', error);
    return false;
  }
}

// When Electron has finished initialization
app.whenReady().then(() => {
  console.log('App is ready, creating window and tray...');
  
  createWindow();
  const trayCreated = createTray();
  
  if (trayCreated) {
    win.webContents.executeJavaScript(`
      document.getElementById('debug-info').innerHTML = 
        '<p><strong>✓ Tray icon created successfully</strong></p>' +
        '<p>Platform: ${process.platform}</p>' +
        '<p>Electron version: ${process.versions.electron}</p>';
    `);
  } else {
    win.webContents.executeJavaScript(`
      document.getElementById('debug-info').innerHTML = 
        '<p><strong>✗ Failed to create tray icon</strong></p>' +
        '<p>Platform: ${process.platform}</p>' +
        '<p>Electron version: ${process.versions.electron}</p>';
    `);
  }
  
  // Handle window close
  win.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      win.hide();
      return false;
    }
    return true;
  });
});

// Quit when all windows are closed except on macOS
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

// Handle app quitting
app.on('before-quit', () => {
  app.isQuitting = true;
});
