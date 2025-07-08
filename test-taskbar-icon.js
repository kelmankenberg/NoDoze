/**
 * Test script for taskbar icon update
 * This shows a simple interface to toggle between active and inactive states
 * and verify that the taskbar icon updates properly
 */

const { app, BrowserWindow, nativeImage, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { forceTaskbarIconUpdate } = require('./src/main/force-taskbar-icon-update');

let mainWindow;
let isActive = false;

// Get icon path based on state
function getIconPath(active) {
  const iconPaths = active ? [
    path.join(__dirname, 'build', 'icons', 'win', 'eye-active.ico'),
    path.join(__dirname, 'build', 'eye-active.ico'),
    path.join(__dirname, 'app.ico')
  ] : [
    path.join(__dirname, 'build', 'icons', 'win', 'eye-inactive.ico'),
    path.join(__dirname, 'build', 'eye-inactive.ico')
  ];
  
  for (const iconPath of iconPaths) {
    if (fs.existsSync(iconPath)) {
      return iconPath;
    }
  }
  
  return null;
}

// Update the application icon
async function updateAppIcon(active) {
  if (!mainWindow) return;
  
  console.log(`Updating app icon to ${active ? 'ACTIVE' : 'INACTIVE'} state`);
  
  const iconPath = getIconPath(active);
  if (!iconPath) {
    console.error('No icon found!');
    return;
  }
  
  console.log(`Using icon: ${iconPath}`);
  
  // Update the window icon
  const icon = nativeImage.createFromPath(iconPath);
  mainWindow.setIcon(icon);
  
  // Force update the taskbar icon (Windows only)
  if (process.platform === 'win32') {
    await forceTaskbarIconUpdate(mainWindow, active);
  }
  
  // Update window title to reflect state
  mainWindow.setTitle(`NoDoze - ${active ? 'ACTIVE' : 'INACTIVE'}`);
}

// Toggle between active and inactive state
async function toggleState() {
  isActive = !isActive;
  await updateAppIcon(isActive);
  
  // Show dialog to confirm state change
  dialog.showMessageBoxSync(mainWindow, {
    type: 'info',
    title: 'State Changed',
    message: `Application is now ${isActive ? 'ACTIVE' : 'INACTIVE'}`,
    detail: 'Check the taskbar icon to verify it has changed. Click OK to continue.',
    buttons: ['OK']
  });
}

// Create application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: true
  });
  
  // Set initial icon
  updateAppIcon(isActive);
  
  // Create simple HTML content with buttons
  const htmlContent = `
    <html>
    <head>
      <title>NoDoze Icon Test</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          text-align: center;
        }
        h1 {
          color: #333;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          margin: 10px;
          cursor: pointer;
        }
        .active {
          background-color: #4CAF50;
          color: white;
        }
        .inactive {
          background-color: #f44336;
          color: white;
        }
      </style>
    </head>
    <body>
      <h1>NoDoze Taskbar Icon Test</h1>
      <p>Click the button below to toggle the application state.</p>
      <p>The taskbar icon should change to reflect the current state.</p>
      <p>Current state: <span id="state">INACTIVE</span></p>
      <button id="toggleBtn">Toggle State</button>
      <script>
        const { ipcRenderer } = require('electron');
        
        document.getElementById('toggleBtn').addEventListener('click', () => {
          ipcRenderer.send('toggle-state');
        });
        
        ipcRenderer.on('state-changed', (event, active) => {
          const stateElement = document.getElementById('state');
          stateElement.textContent = active ? 'ACTIVE' : 'INACTIVE';
          stateElement.style.color = active ? '#4CAF50' : '#f44336';
          
          const toggleBtn = document.getElementById('toggleBtn');
          toggleBtn.className = active ? 'active' : 'inactive';
          toggleBtn.textContent = active ? 'Switch to Inactive' : 'Switch to Active';
        });
      </script>
    </body>
    </html>
  `;
  
  // Write HTML to a temporary file
  const tempHtmlPath = path.join(app.getPath('temp'), 'nodoze-icon-test.html');
  fs.writeFileSync(tempHtmlPath, htmlContent);
  
  // Load the HTML file
  mainWindow.loadFile(tempHtmlPath);
  
  // Setup IPC handlers
  const { ipcMain } = require('electron');
  ipcMain.on('toggle-state', async () => {
    await toggleState();
    mainWindow.webContents.send('state-changed', isActive);
  });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

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
