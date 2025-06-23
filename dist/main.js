/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main/index.ts":
/*!***************************!*\
  !*** ./src/main/index.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const path = __importStar(__webpack_require__(/*! path */ "path"));
// Import platform-specific modules
const windowsImpl = __importStar(__webpack_require__(/*! ./platforms/windows */ "./src/main/platforms/windows.ts"));
const macosImpl = __importStar(__webpack_require__(/*! ./platforms/macos */ "./src/main/platforms/macos.ts"));
const linuxImpl = __importStar(__webpack_require__(/*! ./platforms/linux */ "./src/main/platforms/linux.ts"));
// Keep a global reference of objects to prevent garbage collection
let mainWindow = null;
let tray = null;
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
    if (isPreventingSleep)
        return;
    const platformImpl = getPlatformImpl();
    if (!platformImpl) {
        console.error('No platform implementation available');
        return;
    }
    try {
        await platformImpl.preventSleep();
        isPreventingSleep = true;
        console.log(`Sleep prevention enabled on ${process.platform}`);
    }
    catch (error) {
        console.error('Error preventing sleep:', error);
    }
};
const allowSleep = async () => {
    if (!isPreventingSleep)
        return;
    const platformImpl = getPlatformImpl();
    if (!platformImpl)
        return;
    try {
        await platformImpl.allowSleep();
        console.log(`Sleep prevention disabled on ${process.platform}`);
    }
    catch (error) {
        console.error('Error allowing sleep:', error);
    }
    isPreventingSleep = false;
};
/**
 * Creates a proper icon for the tray based on the platform and active state
 */
function createTrayIcon(active = false) {
    let iconName = active ? 'icon-active.svg' : 'icon-inactive.svg';
    // Determine the correct path to the icon based on whether the app is packaged
    const iconPath = path.join(electron_1.app.isPackaged
        ? path.dirname(electron_1.app.getPath('exe'))
        : path.join(__dirname, '..'), 'public', iconName);
    try {
        // Create a native image from the file
        const icon = electron_1.nativeImage.createFromPath(iconPath);
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
    }
    catch (error) {
        console.error(`Failed to load tray icon (${iconName}):`, error);
        // Try using the default icon as fallback
        try {
            const fallbackPath = path.join(electron_1.app.isPackaged
                ? path.dirname(electron_1.app.getPath('exe'))
                : path.join(__dirname, '..'), 'public', 'icon.svg');
            return electron_1.nativeImage.createFromPath(fallbackPath);
        }
        catch (fallbackError) {
            // Return a small empty image as last resort fallback
            return electron_1.nativeImage.createEmpty();
        }
    }
}
/**
 * Creates a system tray icon with menu
 */
function createTray() {
    // Don't create a tray if it already exists
    if (tray !== null)
        return;
    // Create the tray icon
    const icon = createTrayIcon(isPreventingSleep);
    tray = new electron_1.Tray(icon);
    tray.setToolTip('NoDoze - Keep Your Computer Awake');
    // Update the context menu
    updateTrayMenu();
    // Show/hide window on tray click
    tray.on('click', () => {
        if (mainWindow?.isVisible()) {
            mainWindow.hide();
        }
        else {
            mainWindow?.show();
        }
    });
}
/**
 * Updates the tray context menu with the current state
 */
function updateTrayMenu() {
    if (!tray)
        return;
    // Update the icon based on the current sleep prevention state
    const trayIcon = createTrayIcon(isPreventingSleep);
    tray.setImage(trayIcon);
    const contextMenu = electron_1.Menu.buildFromTemplate([
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
                }
                else {
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
            checked: electron_1.app.getLoginItemSettings().openAtLogin,
            click: (menuItem) => {
                electron_1.app.setLoginItemSettings({
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
                electron_1.app.quit();
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
    // Update tray tooltip based on sleep prevention state
    tray.setToolTip(`NoDoze - ${isPreventingSleep ? 'Sleep Prevention Active' : 'Idle'}`);
}
function createWindow() {
    // Create the browser window
    mainWindow = new electron_1.BrowserWindow({
        width: 380,
        height: 450,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(electron_1.app.isPackaged ? path.dirname(electron_1.app.getPath('exe')) : path.join(__dirname, '..'), 'public', 'icon.png'),
        resizable: false,
    });
    // Set the title
    mainWindow.setTitle('NoDoze');
    console.log('Window title set to NoDoze');
    // Load the index.html file
    const indexPath = electron_1.app.isPackaged
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
    if (!electron_1.app.isPackaged) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
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
        }
        catch (error) {
            console.error('Error initializing platform:', error);
        }
    }
};
// This method will be called when Electron has finished initialization
electron_1.app.whenReady().then(() => {
    initializePlatform();
    createWindow();
    createTray();
    electron_1.app.on('activate', function () {
        // On macOS it's common to re-create a window when the dock icon is clicked
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Quit when all windows are closed, except on macOS
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
// IPC handlers for renderer process communication
electron_1.ipcMain.on('toggle-sleep-prevention', async (_, shouldPrevent) => {
    if (shouldPrevent) {
        await preventSleep();
    }
    else {
        await allowSleep();
    }
    // Update the tray menu with the new state
    updateTrayMenu();
    // Notify renderer of status change
    mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
});
electron_1.ipcMain.handle('get-sleep-status', () => {
    return isPreventingSleep;
});
// Clean up before quitting
electron_1.app.on('before-quit', async () => {
    // Mark the app as quitting to allow window close
    isAppQuitting = true;
    await allowSleep();
    // Clean up platform-specific resources
    const platformImpl = getPlatformImpl();
    if (platformImpl && platformImpl.cleanup) {
        try {
            await platformImpl.cleanup();
        }
        catch (error) {
            console.error('Error during platform cleanup:', error);
        }
    }
    // Destroy the tray icon
    if (tray) {
        tray.destroy();
        tray = null;
    }
});


/***/ }),

/***/ "./src/main/platforms/linux.ts":
/*!*************************************!*\
  !*** ./src/main/platforms/linux.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cleanup = exports.allowSleep = exports.preventSleep = exports.initialize = void 0;
/**
 * Linux platform-specific implementation for NoDoze
 * Uses a combination of dbus and xdg-screensaver commands to prevent sleep
 */
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
let inhibitCookie = null;
let screenSaverProcess = null;
/**
 * Initialize Linux sleep prevention systems
 */
const initialize = () => {
    // Nothing specific to initialize for Linux
    return true;
};
exports.initialize = initialize;
/**
 * Run a command and return its output
 */
const executeCommand = (command) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
};
/**
 * Prevent the system from sleeping using D-Bus and xdg-screensaver
 */
const preventSleep = async () => {
    if (inhibitCookie || screenSaverProcess) {
        return true; // Already preventing sleep
    }
    try {
        // Try using dbus-send to inhibit sleep via org.freedesktop.PowerManagement
        try {
            const result = await executeCommand('dbus-send --system --print-reply --dest="org.freedesktop.login1" ' +
                '/org/freedesktop/login1 org.freedesktop.login1.Manager.Inhibit ' +
                'string:"sleep" string:"NoDoze" string:"Preventing system sleep" ' +
                'string:"block"');
            // Extract the inhibit cookie from dbus reply
            const match = result.match(/uint32 (\d+)/);
            if (match && match[1]) {
                inhibitCookie = match[1];
                console.log(`Linux sleep inhibitor enabled (cookie: ${inhibitCookie})`);
            }
        }
        catch (dbusError) {
            console.warn('Failed to inhibit sleep via dbus:', dbusError);
        }
        // Also use xdg-screensaver to prevent screen blanking
        // This is a fallback method which works on most desktop environments
        screenSaverProcess = (0, child_process_1.spawn)('xdg-screensaver', ['suspend', 'nodoze']);
        screenSaverProcess.on('error', (err) => {
            console.error('xdg-screensaver error:', err);
            screenSaverProcess = null;
        });
        console.log('Linux sleep prevention enabled');
        return true;
    }
    catch (error) {
        console.error('Failed to prevent sleep on Linux:', error);
        return false;
    }
};
exports.preventSleep = preventSleep;
/**
 * Allow the system to sleep normally
 */
const allowSleep = async () => {
    try {
        // Release D-Bus inhibitor if we have one
        if (inhibitCookie) {
            try {
                await executeCommand('dbus-send --system --print-reply --dest="org.freedesktop.login1" ' +
                    `/org/freedesktop/login1 org.freedesktop.login1.Manager.UnInhibit ` +
                    `uint32:${inhibitCookie}`);
            }
            catch (dbusError) {
                console.warn('Failed to uninhibit via dbus:', dbusError);
            }
            inhibitCookie = null;
        }
        // Kill the screensaver process if it's running
        if (screenSaverProcess) {
            screenSaverProcess.kill();
            screenSaverProcess = null;
            // Also run xdg-screensaver resume to be sure
            try {
                await executeCommand('xdg-screensaver resume nodoze');
            }
            catch (error) {
                console.warn('xdg-screensaver resume warning:', error);
            }
        }
        console.log('Linux sleep prevention disabled');
        return true;
    }
    catch (error) {
        console.error('Failed to restore sleep settings on Linux:', error);
        return false;
    }
};
exports.allowSleep = allowSleep;
/**
 * Clean up resources
 */
const cleanup = async () => {
    try {
        await (0, exports.allowSleep)();
    }
    catch (error) {
        console.error('Error during Linux cleanup:', error);
    }
    inhibitCookie = null;
    if (screenSaverProcess) {
        screenSaverProcess.kill();
        screenSaverProcess = null;
    }
};
exports.cleanup = cleanup;


/***/ }),

/***/ "./src/main/platforms/macos.ts":
/*!*************************************!*\
  !*** ./src/main/platforms/macos.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cleanup = exports.allowSleep = exports.preventSleep = exports.initialize = void 0;
/**
 * macOS platform-specific implementation for NoDoze
 * Uses IOKit power assertions to prevent sleep
 */
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
let assertionId = null;
/**
 * Initialize macOS sleep prevention
 */
const initialize = () => {
    // Nothing specific to initialize for macOS
    return true;
};
exports.initialize = initialize;
/**
 * Helper function to execute macOS caffeinate command
 */
const executeCaffeinate = (args) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`caffeinate ${args}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
};
/**
 * Prevent the system from sleeping
 * Uses the built-in caffeinate command on macOS
 */
const preventSleep = async () => {
    if (assertionId) {
        return true; // Already preventing sleep
    }
    try {
        // Start caffeinate in background mode to prevent display and system sleep
        // -d prevents display sleep, -i prevents idle sleep
        assertionId = await executeCaffeinate('-d -i &');
        console.log(`Sleep prevention enabled on macOS (PID: ${assertionId})`);
        return true;
    }
    catch (error) {
        console.error('Failed to prevent sleep on macOS:', error);
        return false;
    }
};
exports.preventSleep = preventSleep;
/**
 * Allow the system to sleep normally
 * Terminates the caffeinate process
 */
const allowSleep = async () => {
    if (!assertionId) {
        return true; // Nothing to restore
    }
    try {
        // Kill the caffeinate process
        await executeCaffeinate(`kill ${assertionId}`);
        console.log('Sleep prevention disabled on macOS');
        assertionId = null;
        return true;
    }
    catch (error) {
        console.error('Failed to restore sleep settings on macOS:', error);
        return false;
    }
};
exports.allowSleep = allowSleep;
/**
 * Clean up resources
 */
const cleanup = async () => {
    if (assertionId) {
        try {
            await (0, exports.allowSleep)();
        }
        catch (error) {
            console.error('Error during macOS cleanup:', error);
        }
        assertionId = null;
    }
};
exports.cleanup = cleanup;


/***/ }),

/***/ "./src/main/platforms/windows.ts":
/*!***************************************!*\
  !*** ./src/main/platforms/windows.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPowerStatus = exports.getLastActivityTime = exports.isPreventingDisplaySleep = exports.getInterval = exports.isPreventingSleep = exports.cleanup = exports.allowSleep = exports.preventSleep = exports.initialize = void 0;
/**
 * Windows platform-specific implementation for NoDoze
 * Uses Windows SetThreadExecutionState API to prevent sleep
 */
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
const ffi = __importStar(__webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'ffi-napi'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
// Define ES_CONTINUOUS and ES_SYSTEM_REQUIRED constants
const ES_CONTINUOUS = 0x80000000;
const ES_SYSTEM_REQUIRED = 0x00000001;
const ES_DISPLAY_REQUIRED = 0x00000002;
let preventSleepTimer = null;
let intervalSeconds = 59; // Default interval
let isActive = false;
let lastActivityTime = null;
let preventDisplaySleep = true; // Default to also prevent display sleep
// Define Windows API functions through FFI
const user32 = ffi.Library('user32', {
    'SetThreadExecutionState': ['uint32', ['uint32']]
});
/**
 * Initialize Windows sleep prevention
 */
const initialize = () => {
    // Nothing specific to initialize for Windows
    return true;
};
exports.initialize = initialize;
/**
 * Prevent the system from going to sleep
 * Uses the Windows SetThreadExecutionState API
 * @param seconds Optional parameter to set the interval in seconds (default: 59)
 * @param keepDisplayOn Optional parameter to also keep the display on (default: true)
 */
const preventSleep = async (seconds = 59, keepDisplayOn = true) => {
    try {
        // Kill any existing process first
        await (0, exports.allowSleep)();
        // Store the settings
        intervalSeconds = seconds;
        preventDisplaySleep = keepDisplayOn;
        // Set the execution state flags
        let flags = ES_CONTINUOUS | ES_SYSTEM_REQUIRED;
        if (keepDisplayOn) {
            flags |= ES_DISPLAY_REQUIRED;
        }
        // Set the initial state
        const result = user32.SetThreadExecutionState(flags);
        if (result === 0) {
            throw new Error('SetThreadExecutionState API call failed');
        }
        // Create a timer to refresh the state periodically
        preventSleepTimer = setInterval(() => {
            user32.SetThreadExecutionState(flags);
            console.log(`NoDoze: Keeping system awake at ${new Date().toISOString()}`);
        }, seconds * 1000);
        // Track activity status and time
        isActive = true;
        lastActivityTime = new Date();
        return true;
    }
    catch (error) {
        console.error('Failed to prevent sleep:', error);
        isActive = false;
        return false;
    }
};
exports.preventSleep = preventSleep;
/**
 * Allow the system to go to sleep by stopping the sleep prevention
 */
const allowSleep = async () => {
    try {
        if (preventSleepTimer) {
            clearInterval(preventSleepTimer);
            preventSleepTimer = null;
        }
        // Reset the execution state to default (allow sleep)
        user32.SetThreadExecutionState(ES_CONTINUOUS);
        isActive = false;
        return true;
    }
    catch (error) {
        console.error('Failed to allow sleep:', error);
        return false;
    }
};
exports.allowSleep = allowSleep;
/**
 * Clean up resources before application exit
 */
const cleanup = async () => {
    return await (0, exports.allowSleep)();
};
exports.cleanup = cleanup;
/**
 * Check if sleep prevention is active
 */
const isPreventingSleep = () => {
    return isActive;
};
exports.isPreventingSleep = isPreventingSleep;
/**
 * Get the current interval setting in seconds
 */
const getInterval = () => {
    return intervalSeconds;
};
exports.getInterval = getInterval;
/**
 * Get whether display sleep is also being prevented
 */
const isPreventingDisplaySleep = () => {
    return preventDisplaySleep;
};
exports.isPreventingDisplaySleep = isPreventingDisplaySleep;
/**
 * Get the timestamp of the last activity
 */
const getLastActivityTime = () => {
    return lastActivityTime;
};
exports.getLastActivityTime = getLastActivityTime;
/**
 * Check the system's current power status
 * Returns information about battery/AC power and current power plan
 */
const getPowerStatus = async () => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)('powercfg /list', (error, stdout) => {
            if (error) {
                console.error('Error getting power status:', error);
                resolve({ onBattery: false, powerPlan: 'Unknown' });
                return;
            }
            // Get power plan info
            const activePlanMatch = stdout.match(/\* (.*?) \((.*?)\)/);
            const powerPlan = activePlanMatch ? activePlanMatch[1] : 'Unknown';
            // Check if system is on battery
            (0, child_process_1.exec)('WMIC Path Win32_Battery Get BatteryStatus', (err, output) => {
                // BatteryStatus = 1 means on battery, 2 means on AC power
                // If there's no battery or an error, assume AC power
                const onBattery = !err && output.includes('1');
                resolve({ onBattery, powerPlan });
            });
        });
    });
};
exports.getPowerStatus = getPowerStatus;


/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map