/**
 * Fix Tray Icon Visibility
 * 
 * This script tests if the system tray icon creation issue is related to 
 * Windows notification area settings or a code problem.
 */

const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let win = null;
let trayEyeActive = null;
let trayEyeInactive = null;
let trayAppIco = null;

// Start app when Electron is ready
app.whenReady().then(() => {
  console.log('App ready, creating test window and tray icons...');
  
  win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  win.loadURL(`data:text/html,
    <html>
      <head>
        <title>Fix Tray Icon Visibility</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          .status { margin: 20px 0; padding: 10px; background: #f5f5f5; }
          .success { color: green; }
          .error { color: red; }
        </style>
      </head>
      <body>
        <h1>Fix Tray Icon Visibility</h1>
        <p>This tool will create multiple tray icons to test which one works correctly.</p>
        <p>You should see 3 different icons in your system tray (notification area):</p>
        <ol>
          <li>Eye Active (Green Eye)</li>
          <li>Eye Inactive (Red Eye)</li>
          <li>App Icon (Main icon)</li>
        </ol>
        <div class="status" id="status">Testing...</div>
      </body>
    </html>
  `);
  
  // Create multiple tray icons to test which ones work
  createTrayIcons();
  
  // Exit handler
  win.on('closed', () => {
    app.quit();
  });
});

function createTrayIcons() {
  const iconPaths = {
    eyeActive: findIconFile('eye-active.ico'),
    eyeInactive: findIconFile('eye-inactive.ico'),
    appIcon: findIconFile('app.ico', 'icon.ico')
  };
  
  console.log('Found icon paths:');
  console.log(iconPaths);
  
  // Create eye-active.ico tray icon
  if (iconPaths.eyeActive) {
    try {
      const icon = require('electron').nativeImage.createFromPath(iconPaths.eyeActive);
      trayEyeActive = new Tray(icon);
      trayEyeActive.setToolTip('NoDoze Eye Active Icon');
      trayEyeActive.setContextMenu(Menu.buildFromTemplate([
        { label: 'Eye Active Icon', enabled: false },
        { label: 'Exit', click: () => app.quit() }
      ]));
      console.log('Created tray icon with eye-active.ico');
      
      win.webContents.executeJavaScript(`
        document.getElementById('status').innerHTML += '<p class="success">✓ Created eye-active.ico tray icon</p>';
      `);
    } catch (err) {
      console.error('Error creating eye-active tray icon:', err);
      win.webContents.executeJavaScript(`
        document.getElementById('status').innerHTML += '<p class="error">✗ Failed to create eye-active.ico tray icon</p>';
      `);
    }
  }
  
  // Create eye-inactive.ico tray icon
  if (iconPaths.eyeInactive) {
    try {
      const icon = require('electron').nativeImage.createFromPath(iconPaths.eyeInactive);
      trayEyeInactive = new Tray(icon);
      trayEyeInactive.setToolTip('NoDoze Eye Inactive Icon');
      trayEyeInactive.setContextMenu(Menu.buildFromTemplate([
        { label: 'Eye Inactive Icon', enabled: false },
        { label: 'Exit', click: () => app.quit() }
      ]));
      console.log('Created tray icon with eye-inactive.ico');
      
      win.webContents.executeJavaScript(`
        document.getElementById('status').innerHTML += '<p class="success">✓ Created eye-inactive.ico tray icon</p>';
      `);
    } catch (err) {
      console.error('Error creating eye-inactive tray icon:', err);
      win.webContents.executeJavaScript(`
        document.getElementById('status').innerHTML += '<p class="error">✗ Failed to create eye-inactive.ico tray icon</p>';
      `);
    }
  }
  
  // Create app.ico tray icon
  if (iconPaths.appIcon) {
    try {
      const icon = require('electron').nativeImage.createFromPath(iconPaths.appIcon);
      trayAppIco = new Tray(icon);
      trayAppIco.setToolTip('NoDoze App Icon');
      trayAppIco.setContextMenu(Menu.buildFromTemplate([
        { label: 'App Icon', enabled: false },
        { label: 'Exit', click: () => app.quit() }
      ]));
      console.log('Created tray icon with app.ico');
      
      win.webContents.executeJavaScript(`
        document.getElementById('status').innerHTML += '<p class="success">✓ Created app.ico tray icon</p>';
      `);
    } catch (err) {
      console.error('Error creating app.ico tray icon:', err);
      win.webContents.executeJavaScript(`
        document.getElementById('status').innerHTML += '<p class="error">✗ Failed to create app.ico tray icon</p>';
      `);
    }
  }
  
  win.webContents.executeJavaScript(`
    document.getElementById('status').innerHTML += '<p>Check your system tray (notification area) now. If you cannot see any icons, click on the up arrow in the system tray to show hidden icons.</p>';
  `);
}

function findIconFile(primary, fallback) {
  const possibleLocations = [
    path.join(__dirname, 'build', 'icons', 'win', primary),
    path.join(__dirname, 'build', primary),
    path.join(__dirname, primary)
  ];
  
  if (fallback) {
    possibleLocations.push(
      path.join(__dirname, 'build', 'icons', 'win', fallback),
      path.join(__dirname, 'build', fallback),
      path.join(__dirname, fallback)
    );
  }
  
  for (const location of possibleLocations) {
    try {
      if (fs.existsSync(location)) {
        return location;
      }
    } catch (err) {
      // Ignore errors
    }
  }
  
  return null;
}
