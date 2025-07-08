/**
 * Test script to verify icon switching behavior in the NoDoze app
 * This script toggles between active and inactive states every 3 seconds
 * to visually confirm that icon switching is working correctly.
 */
const { app, BrowserWindow, Tray } = require('electron');
const path = require('path');
const fs = require('fs');

// Import the JavaScript version of the icon management functions
const { createTrayIcon, createAppIcon, updateAppIcons } = require('./src/main/icon-manager-test');

let mainWindow;
let tray;
let isActive = false;

// Toggle state every 3 seconds
function toggleState() {
  isActive = !isActive;
  console.log(`--------------------------`);
  console.log(`State toggled to: ${isActive ? 'ACTIVE' : 'INACTIVE'}`);
  
  // Update icons based on new state
  if (mainWindow && tray) {
    // Update icons without using overlay
    updateAppIcons(mainWindow, tray, isActive);
    
    // Explicitly ensure we're not using an overlay icon on Windows
    if (process.platform === 'win32') {
      console.log('Clearing any overlay icon (Windows)');
      mainWindow.setOverlayIcon(null, '');
    }
    
    console.log(`Icons updated to ${isActive ? 'ACTIVE' : 'INACTIVE'} state`);
    console.log(`You should now see the ${isActive ? 'eye-active.ico' : 'eye-inactive.ico'} icon in both taskbar and tray`);
  }
  
  // Schedule next toggle
  setTimeout(toggleState, 3000);
}

app.whenReady().then(() => {
  console.log('=======================================');
  console.log('Starting NoDoze icon toggle test');
  console.log('This test will toggle between active and inactive icons every 3 seconds');
  console.log('The entire icon should change, without using any overlay badges');
  console.log('=======================================');
  
  // Create main window
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: true
  });
  
  mainWindow.loadFile('public/index.html');
  mainWindow.on('closed', () => mainWindow = null);
  
  // Create tray icon
  tray = new Tray(createTrayIcon(isActive));
  tray.setToolTip('NoDoze Icon Test');
  
  // Set initial icons
  updateAppIcons(mainWindow, tray, isActive);
  
  // Start toggling state
  setTimeout(toggleState, 3000);
  
  console.log('Test running - icons should toggle between active/inactive states every 3 seconds');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
