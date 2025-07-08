/**
 * Enhanced Tray Menu Manager
 * 
 * This utility provides an improved tray menu system with:
 * - Better organization
 * - More features
 * - Enhanced error handling
 * - Cleaner code structure
 */

import { Menu, MenuItem, MenuItemConstructorOptions, Tray, app, BrowserWindow, dialog } from 'electron';
import { SleepPreventionManager, SleepPreventionMode } from './activity/SleepPreventionManager';
import { SettingsManager } from './SettingsManager';
import iconManager from './icon-manager-improved';

// Type definitions
export interface TrayMenuOptions {
  mainWindow: BrowserWindow | null;
  tray: Tray | null;
  sleepPreventionManager: SleepPreventionManager;
  settingsManager: SettingsManager;
  isPreventingSleep: boolean;
  preventSleep: () => Promise<void>;
  allowSleep: () => Promise<void>;
  changeSleepPreventionMode: (mode: SleepPreventionMode) => Promise<void>;
  startTimer: (minutes: number) => Promise<void>;
  stopTimer: () => Promise<void>;
  exitApplication: () => void;
}

/**
 * TrayMenuManager class for handling all tray menu functionality
 */
export class TrayMenuManager {
  private options: TrayMenuOptions;
  private customTimerMinutes = 60; // Default custom timer value
  
  constructor(options: TrayMenuOptions) {
    this.options = options;
  }
  
  /**
   * Create and configure the tray icon and menu
   */
  public createTray(): Tray | null {
    try {
      // Don't create a tray if it already exists
      if (this.options.tray !== null) return this.options.tray;
      
      // Create the tray icon
      const icon = iconManager.getTrayIcon(this.options.isPreventingSleep);
      const tray = new Tray(icon);
      tray.setToolTip(`NoDoze - Keep Your Computer Awake`);
      
      // Update the context menu
      this.updateTrayMenu(tray);
      
      // Show/hide window on tray click
      tray.on('click', () => {
        if (this.options.mainWindow?.isVisible()) {
          this.options.mainWindow.hide();
        } else {
          this.options.mainWindow?.show();
        }
      });
      
      return tray;
    } catch (error) {
      console.error('Error creating tray:', error);
      dialog.showErrorBox(
        'Tray Creation Error',
        `Failed to create system tray icon: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return null;
    }
  }
  
  /**
   * Update the tray context menu with the current state
   */
  public updateTrayMenu(tray: Tray | null = this.options.tray): void {
    if (!tray) return;
    
    try {
      // Update both tray and app icons based on current state
      iconManager.updateAppIcons(
        this.options.mainWindow, 
        tray, 
        this.options.isPreventingSleep
      );
      
      const state = this.options.sleepPreventionManager.getState();
      const uiSettings = this.options.settingsManager.getUISettings();
      const timerActive = state.timerActive || false;
      const timeRemaining = state.timeRemaining || 0;
      
      // Build main menu template
      const template: MenuItemConstructorOptions[] = this.buildMenuTemplate(state, uiSettings, timerActive, timeRemaining);
      
      // Create and set the context menu
      const contextMenu = Menu.buildFromTemplate(template);
      tray.setContextMenu(contextMenu);
      
      console.log('Tray menu updated successfully');
    } catch (error) {
      console.error('Error updating tray menu:', error);
    }
  }
  
  /**
   * Build the menu template based on current state
   */
  private buildMenuTemplate(
    state: any,
    uiSettings: any,
    timerActive: boolean,
    timeRemaining: number
  ): MenuItemConstructorOptions[] {
    // Header section
    const template: MenuItemConstructorOptions[] = [
      { 
        label: 'Open NoDoze', 
        click: () => { this.options.mainWindow?.show(); }
      },
      { type: 'separator' }
    ];
    
    // Sleep prevention toggle
    template.push({ 
      label: 'Prevent Sleep', 
      type: 'checkbox',
      checked: this.options.isPreventingSleep,
      click: async (menuItem) => {
        try {
          if (menuItem.checked) {
            await this.options.preventSleep();
          } else {
            await this.options.allowSleep();
          }
          this.updateTrayMenu();
          this.options.mainWindow?.webContents.send(
            'sleep-status-changed', 
            this.options.isPreventingSleep
          );
        } catch (error) {
          console.error('Error toggling sleep prevention:', error);
          dialog.showErrorBox(
            'Sleep Prevention Error',
            `Failed to toggle sleep prevention: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    });
    
    // Sleep prevention mode submenu
    template.push({
      label: 'Sleep Prevention Mode',
      submenu: this.buildSleepPreventionModeSubmenu(state)
    });
    
    // Quick timer submenu
    template.push({
      label: timerActive ? `Timer: ${this.formatTimeRemaining(timeRemaining)}` : 'Quick Timer',
      submenu: this.buildTimerSubmenu(timerActive)
    });
    
    // Settings submenu
    template.push({
      label: 'Settings',
      submenu: this.buildSettingsSubmenu(uiSettings)
    });
    
    // Footer section
    template.push(
      { type: 'separator' },
      { 
        label: 'Quit NoDoze', 
        click: () => { this.options.exitApplication(); }
      }
    );
    
    return template;
  }
  
  /**
   * Build the sleep prevention mode submenu
   */
  private buildSleepPreventionModeSubmenu(state: any): MenuItemConstructorOptions[] {
    return [
      {
        label: 'Basic (Sleep only)',
        type: 'radio',
        checked: state.mode === SleepPreventionMode.BASIC,
        click: async () => {
          await this.changeSleepPreventionModeAndUpdate(SleepPreventionMode.BASIC);
        }
      },
      {
        label: 'Full (Sleep + Activity)',
        type: 'radio',
        checked: state.mode === SleepPreventionMode.FULL,
        click: async () => {
          await this.changeSleepPreventionModeAndUpdate(SleepPreventionMode.FULL);
        }
      },
      {
        label: 'Activity Only',
        type: 'radio',
        checked: state.mode === SleepPreventionMode.ACTIVITY_ONLY,
        click: async () => {
          await this.changeSleepPreventionModeAndUpdate(SleepPreventionMode.ACTIVITY_ONLY);
        }
      },
      {
        type: 'separator'
      },
      {
        label: `Current: ${this.options.sleepPreventionManager.getModeDisplayName(state.mode)}`,
        enabled: false
      }
    ];
  }
  
  /**
   * Build the timer submenu
   */
  private buildTimerSubmenu(timerActive: boolean): MenuItemConstructorOptions[] {
    // Timer inactive - show preset options
    if (!timerActive) {
      return [
        {
          label: '15 Minutes',
          click: async () => {
            await this.startTimerAndUpdate(15);
          }
        },
        {
          label: '30 Minutes',
          click: async () => {
            await this.startTimerAndUpdate(30);
          }
        },
        {
          label: '1 Hour',
          click: async () => {
            await this.startTimerAndUpdate(60);
          }
        },
        {
          label: '2 Hours',
          click: async () => {
            await this.startTimerAndUpdate(120);
          }
        },
        {
          label: '4 Hours',
          click: async () => {
            await this.startTimerAndUpdate(240);
          }
        },
        { type: 'separator' },
        {
          label: 'Custom Timer...',
          click: () => {
            this.showCustomTimerDialog();
          }
        }
      ];
    }
    
    // Timer active - show cancel option
    return [
      {
        label: 'Cancel Timer',
        click: async () => {
          await this.cancelTimerAndUpdate();
        }
      }
    ];
  }
  
  /**
   * Build the settings submenu
   */
  private buildSettingsSubmenu(uiSettings: any): MenuItemConstructorOptions[] {
    return [
      {
        label: 'Start with System',
        type: 'checkbox',
        checked: app.getLoginItemSettings().openAtLogin,
        click: (menuItem) => {
          this.toggleStartWithSystem(menuItem.checked);
        }
      },
      {
        label: 'Minimize to Tray',
        type: 'checkbox',
        checked: uiSettings.minimizeToTray,
        click: (menuItem) => {
          this.toggleMinimizeToTray(menuItem.checked);
        }
      },
      {
        label: 'Show Notifications',
        type: 'checkbox',
        checked: uiSettings.showNotifications,
        click: (menuItem) => {
          this.toggleShowNotifications(menuItem.checked);
        }
      }
    ];
  }
  
  /**
   * Helper to change sleep prevention mode and update UI
   */
  private async changeSleepPreventionModeAndUpdate(mode: SleepPreventionMode): Promise<void> {
    try {
      await this.options.changeSleepPreventionMode(mode);
      this.updateTrayMenu();
    } catch (error) {
      console.error('Error changing sleep prevention mode:', error);
      dialog.showErrorBox(
        'Mode Change Error',
        `Failed to change sleep prevention mode: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
  
  /**
   * Helper to start timer and update UI
   */
  private async startTimerAndUpdate(minutes: number): Promise<void> {
    try {
      await this.options.startTimer(minutes);
      await this.options.preventSleep();
      this.updateTrayMenu();
    } catch (error) {
      console.error('Error starting timer:', error);
      dialog.showErrorBox(
        'Timer Error',
        `Failed to start timer: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
  
  /**
   * Helper to cancel timer and update UI
   */
  private async cancelTimerAndUpdate(): Promise<void> {
    try {
      await this.options.stopTimer();
      this.updateTrayMenu();
    } catch (error) {
      console.error('Error canceling timer:', error);
      dialog.showErrorBox(
        'Timer Error',
        `Failed to cancel timer: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
  
  /**
   * Show dialog for custom timer input
   */
  private showCustomTimerDialog(): void {
    if (!this.options.mainWindow) return;
    
    // Send request to renderer to show custom timer dialog
    this.options.mainWindow.webContents.send('show-custom-timer-dialog', this.customTimerMinutes);
    
    // Ensure window is visible
    if (!this.options.mainWindow.isVisible()) {
      this.options.mainWindow.show();
    }
  }
  
  /**
   * Toggle start with system setting
   */
  private toggleStartWithSystem(enabled: boolean): void {
    try {
      app.setLoginItemSettings({
        openAtLogin: enabled,
        openAsHidden: enabled // Start minimized when launching at login
      });
      
      console.log(`Set start with system: ${enabled}`);
    } catch (error) {
      console.error('Error setting login item settings:', error);
      dialog.showErrorBox(
        'Settings Error',
        `Failed to change startup settings: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
  
  /**
   * Toggle minimize to tray setting
   */
  private toggleMinimizeToTray(enabled: boolean): void {
    try {
      const uiSettings = this.options.settingsManager.getUISettings();
      this.options.settingsManager.setUISettings({
        ...uiSettings,
        minimizeToTray: enabled
      });
      
      console.log(`Set minimize to tray: ${enabled}`);
    } catch (error) {
      console.error('Error setting minimize to tray:', error);
      dialog.showErrorBox(
        'Settings Error',
        `Failed to change minimize settings: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
  
  /**
   * Toggle show notifications setting
   */
  private toggleShowNotifications(enabled: boolean): void {
    try {
      const uiSettings = this.options.settingsManager.getUISettings();
      this.options.settingsManager.setUISettings({
        ...uiSettings,
        showNotifications: enabled
      });
      
      console.log(`Set show notifications: ${enabled}`);
    } catch (error) {
      console.error('Error setting show notifications:', error);
      dialog.showErrorBox(
        'Settings Error',
        `Failed to change notification settings: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
  
  /**
   * Format remaining time in a human-readable way
   */
  private formatTimeRemaining(seconds: number): string {
    if (seconds <= 0) return 'Finishing...';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s remaining`;
    } else {
      return `${remainingSeconds}s remaining`;
    }
  }
}
