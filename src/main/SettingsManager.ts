/**
 * Settings Manager
 * Handles persistence of user preferences and settings
 */

import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { SleepPreventionMode, SleepPreventionConfig } from './activity/SleepPreventionManager';

export interface UserSettings {
  sleepPreventionMode: SleepPreventionMode;
  activitySimulation: {
    interval: number;
    activityType: 'mouse' | 'keyboard' | 'both';
  };
  ui: {
    windowPosition?: { x: number; y: number };
    windowSize?: { width: number; height: number };
    minimizeToTray: boolean;
    showNotifications: boolean;
    theme: 'light' | 'dark';
  };
  version: string;
}

export class SettingsManager {
  private settingsPath: string;
  private settings: UserSettings;

  constructor() {
    this.settingsPath = path.join(app.getPath('userData'), 'settings.json');
    this.settings = this.getDefaultSettings();
    this.loadSettings();
  }

  /**
   * Get default settings
   */
  private getDefaultSettings(): UserSettings {
    return {
      sleepPreventionMode: SleepPreventionMode.FULL,
      activitySimulation: {
        interval: 30000, // 30 seconds
        activityType: 'both'
      },
      ui: {
        minimizeToTray: true,
        showNotifications: true,
        theme: 'light'
      },
      version: '1.0.0'
    };
  }

  /**
   * Load settings from disk
   */
  private loadSettings(): void {
    try {
      if (fs.existsSync(this.settingsPath)) {
        console.log(`SettingsManager: Loading settings from ${this.settingsPath}`);
        const data = fs.readFileSync(this.settingsPath, 'utf8');
        const loadedSettings = JSON.parse(data);
        console.log('SettingsManager: Loaded settings:', JSON.stringify(loadedSettings, null, 2));
        
        // Get default settings
        const defaultSettings = this.getDefaultSettings();
        console.log('SettingsManager: Default settings:', JSON.stringify(defaultSettings, null, 2));
        
        // Deep merge settings recursively to preserve all nested properties
        const deepMerge = (target: any, source: any): any => {
          for (const key in source) {
            if (source.hasOwnProperty(key)) {
              if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                // If property is an object, recursively merge
                target[key] = target[key] || {};
                target[key] = deepMerge(target[key], source[key]);
              } else {
                // Otherwise, overwrite with source value
                target[key] = source[key];
              }
            }
          }
          return target;
        };
        
        // Apply deep merge with defaults and loaded settings
        this.settings = deepMerge(JSON.parse(JSON.stringify(defaultSettings)), loadedSettings);
        
        console.log('SettingsManager: Merged settings:', JSON.stringify(this.settings, null, 2));
        console.log('SettingsManager: Theme after loading:', this.settings.ui?.theme);
        
        // Ensure theme property exists
        if (!this.settings.ui) {
          console.log('SettingsManager: ui object missing, creating it');
          this.settings.ui = defaultSettings.ui;
        }
        
        if (!this.settings.ui.theme) {
          console.log('SettingsManager: theme property missing, using default');
          this.settings.ui.theme = defaultSettings.ui.theme;
        }
        
        console.log('SettingsManager: Settings loaded successfully');
      } else {
        console.log('SettingsManager: No settings file found, using defaults');
        this.settings = this.getDefaultSettings();
        this.saveSettings(); // Create initial settings file
      }
    } catch (error) {
      console.error('SettingsManager: Error loading settings:', error);
      this.settings = this.getDefaultSettings();
    }
  }

  /**
   * Save settings to disk
   */
  private saveSettings(): void {
    try {
      console.log(`SettingsManager: Saving settings to ${this.settingsPath}`);
      console.log('SettingsManager: Settings to save:', JSON.stringify(this.settings, null, 2));
      
      const settingsDir = path.dirname(this.settingsPath);
      if (!fs.existsSync(settingsDir)) {
        console.log(`SettingsManager: Creating settings directory: ${settingsDir}`);
        fs.mkdirSync(settingsDir, { recursive: true });
      }

      // Make sure the theme property exists before saving
      if (!this.settings.ui.hasOwnProperty('theme')) {
        console.log('SettingsManager: Theme property missing, adding default');
        this.settings.ui.theme = 'light';
      }

      fs.writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2));
      console.log('SettingsManager: Settings saved successfully');
      
      // Verify the file was written correctly
      if (fs.existsSync(this.settingsPath)) {
        const savedData = fs.readFileSync(this.settingsPath, 'utf8');
        const savedSettings = JSON.parse(savedData);
        console.log('SettingsManager: Verified saved settings:', JSON.stringify(savedSettings, null, 2));
      }
    } catch (error) {
      console.error('SettingsManager: Error saving settings:', error);
    }
  }

  /**
   * Get all settings
   */
  getSettings(): UserSettings {
    return { ...this.settings };
  }

  /**
   * Get sleep prevention mode
   */
  getSleepPreventionMode(): SleepPreventionMode {
    return this.settings.sleepPreventionMode;
  }

  /**
   * Set sleep prevention mode
   */
  setSleepPreventionMode(mode: SleepPreventionMode): void {
    this.settings.sleepPreventionMode = mode;
    this.saveSettings();
  }

  /**
   * Get activity simulation settings
   */
  getActivitySimulationSettings(): {
    interval: number;
    activityType: 'mouse' | 'keyboard' | 'both';
  } {
    return { ...this.settings.activitySimulation };
  }

  /**
   * Set activity simulation settings
   */
  setActivitySimulationSettings(settings: {
    interval?: number;
    activityType?: 'mouse' | 'keyboard' | 'both';
  }): void {
    this.settings.activitySimulation = {
      ...this.settings.activitySimulation,
      ...settings
    };
    this.saveSettings();
  }

  /**
   * Get UI settings
   */
  getUISettings(): UserSettings['ui'] {
    return { ...this.settings.ui };
  }

  /**
   * Set UI settings
   */
  setUISettings(settings: Partial<UserSettings['ui']>): void {
    this.settings.ui = {
      ...this.settings.ui,
      ...settings
    };
    this.saveSettings();
  }

  /**
   * Get window position
   */
  getWindowPosition(): { x: number; y: number } | undefined {
    return this.settings.ui.windowPosition;
  }

  /**
   * Set window position
   */
  setWindowPosition(position: { x: number; y: number }): void {
    this.settings.ui.windowPosition = position;
    this.saveSettings();
  }

  /**
   * Get window size
   */
  getWindowSize(): { width: number; height: number } | undefined {
    return this.settings.ui.windowSize;
  }

  /**
   * Set window size
   */
  setWindowSize(size: { width: number; height: number }): void {
    this.settings.ui.windowSize = size;
    this.saveSettings();
  }

  /**
   * Get theme preference
   */
  getTheme(): 'light' | 'dark' {
    console.log('SettingsManager: Getting theme preference, current settings:', JSON.stringify(this.settings, null, 2));
    const theme = this.settings.ui.theme || 'light';
    console.log(`SettingsManager: Current theme is ${theme}`);
    return theme;
  }

  /**
   * Set theme preference
   */
  setTheme(theme: 'light' | 'dark'): void {
    console.log(`SettingsManager: Setting theme to ${theme}`);
    if (!this.settings.ui) {
      console.log('SettingsManager: ui object is missing, creating it');
      this.settings.ui = {
        minimizeToTray: true,
        showNotifications: true,
        theme: theme
      };
    } else {
      console.log('SettingsManager: Updating ui.theme property');
      this.settings.ui.theme = theme;
    }
    console.log('SettingsManager: Settings after update:', JSON.stringify(this.settings, null, 2));
    this.saveSettings();
  }

  /**
   * Reset settings to defaults
   */
  resetSettings(): void {
    this.settings = this.getDefaultSettings();
    this.saveSettings();
  }

  /**
   * Export settings to JSON string
   */
  exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  /**
   * Import settings from JSON string
   */
  importSettings(jsonString: string): boolean {
    try {
      const importedSettings = JSON.parse(jsonString);
      
      // Validate the imported settings
      if (this.validateSettings(importedSettings)) {
        this.settings = {
          ...this.getDefaultSettings(),
          ...importedSettings
        };
        this.saveSettings();
        return true;
      } else {
        console.error('Invalid settings format');
        return false;
      }
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }

  /**
   * Validate settings structure
   */
  private validateSettings(settings: any): boolean {
    try {
      // Check required properties exist
      const basicValidation = (
        typeof settings === 'object' &&
        typeof settings.sleepPreventionMode === 'string' &&
        Object.values(SleepPreventionMode).includes(settings.sleepPreventionMode) &&
        typeof settings.activitySimulation === 'object' &&
        typeof settings.activitySimulation.interval === 'number' &&
        typeof settings.activitySimulation.activityType === 'string' &&
        ['mouse', 'keyboard', 'both'].includes(settings.activitySimulation.activityType)
      );
      
      // Don't strictly require the theme property, but validate it if it exists
      if (basicValidation) {
        // If ui or ui.theme doesn't exist, that's fine - we'll use defaults
        if (!settings.ui || !settings.ui.theme) {
          console.log('SettingsManager: Theme not found in settings, will use default');
          return true;
        }
        
        // If theme exists, make sure it's a valid value
        if (typeof settings.ui.theme === 'string' && 
            ['light', 'dark'].includes(settings.ui.theme)) {
          console.log(`SettingsManager: Valid theme found in settings: ${settings.ui.theme}`);
          return true;
        } else {
          console.log(`SettingsManager: Invalid theme value found: ${settings.ui.theme}`);
          return false;
        }
      }
      
      return basicValidation;
    } catch (error) {
      console.error('SettingsManager: Error validating settings:', error);
      return false;
    }
  }

  /**
   * Get sleep prevention config for the manager
   */
  getSleepPreventionConfig(): SleepPreventionConfig {
    const activitySettings = this.getActivitySimulationSettings();
    return {
      defaultMode: this.getSleepPreventionMode(),
      activityInterval: activitySettings.interval,
      activityType: activitySettings.activityType,
      debug: process.env.NODE_ENV === 'development'
    };
  }

  /**
   * Get settings file path
   */
  getSettingsPath(): string {
    return this.settingsPath;
  }
}
