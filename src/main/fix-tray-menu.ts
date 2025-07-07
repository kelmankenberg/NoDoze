import { app, BrowserWindow, Menu, Tray } from 'electron';
import { updateTrayIcon, updateWindowIcon } from './icon-helper';

/**
 * Updates the tray context menu with the current state
 */
export function updateTrayMenu(
  tray: Tray | null,
  mainWindow: BrowserWindow | null,
  isPreventingSleep: boolean,
  preventSleepFn: () => Promise<void>,
  allowSleepFn: () => Promise<void>
) {
  if (!tray) return;
  
  console.log(`Updating tray menu and icons (active=${isPreventingSleep})`);
  
  // Use our helper functions to update icons
  updateTrayIcon(tray, isPreventingSleep);
  updateWindowIcon(mainWindow, isPreventingSleep);
  
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
          await preventSleepFn();
        } else {
          await allowSleepFn();
        }
        // Recursively update the menu with new state
        updateTrayMenu(tray, mainWindow, isPreventingSleep, preventSleepFn, allowSleepFn);
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
            await preventSleepFn();
            updateTrayMenu(tray, mainWindow, isPreventingSleep, preventSleepFn, allowSleepFn);
            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            mainWindow?.webContents.send('set-quick-timer', 15);
            
            // Set a timeout to disable sleep prevention
            setTimeout(async () => {
              await allowSleepFn();
              updateTrayMenu(tray, mainWindow, isPreventingSleep, preventSleepFn, allowSleepFn);
              mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            }, 15 * 60 * 1000);
          }
        },
        {
          label: '30 Minutes',
          click: async () => {
            await preventSleepFn();
            updateTrayMenu(tray, mainWindow, isPreventingSleep, preventSleepFn, allowSleepFn);
            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            mainWindow?.webContents.send('set-quick-timer', 30);
            
            setTimeout(async () => {
              await allowSleepFn();
              updateTrayMenu(tray, mainWindow, isPreventingSleep, preventSleepFn, allowSleepFn);
              mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            }, 30 * 60 * 1000);
          }
        },
        {
          label: '1 Hour',
          click: async () => {
            await preventSleepFn();
            updateTrayMenu(tray, mainWindow, isPreventingSleep, preventSleepFn, allowSleepFn);
            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            mainWindow?.webContents.send('set-quick-timer', 60);
            
            setTimeout(async () => {
              await allowSleepFn();
              updateTrayMenu(tray, mainWindow, isPreventingSleep, preventSleepFn, allowSleepFn);
              mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            }, 60 * 60 * 1000);
          }
        },
        {
          label: '2 Hours',
          click: async () => {
            await preventSleepFn();
            updateTrayMenu(tray, mainWindow, isPreventingSleep, preventSleepFn, allowSleepFn);
            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            mainWindow?.webContents.send('set-quick-timer', 120);
            
            setTimeout(async () => {
              await allowSleepFn();
              updateTrayMenu(tray, mainWindow, isPreventingSleep, preventSleepFn, allowSleepFn);
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
        await allowSleepFn();
        app.quit(); 
      }
    }
  ]);
  
  // Set the context menu
  tray.setContextMenu(contextMenu);
  
  // Update tray tooltip based on sleep prevention state
  tray.setToolTip(`NoDoze - ${isPreventingSleep ? 'Sleep Prevention Active' : 'Idle'}`);
}
