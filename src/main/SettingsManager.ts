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
        showNotifications: true
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
        const data = fs.readFileSync(this.settingsPath, 'utf8');
        const loadedSettings = JSON.parse(data);
        
        // Merge with defaults to ensure all properties exist
        this.settings = {
          ...this.getDefaultSettings(),
          ...loadedSettings
        };
        
        console.log('Settings loaded successfully');
      } else {
        console.log('No settings file found, using defaults');
        this.saveSettings(); // Create initial settings file
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      this.settings = this.getDefaultSettings();
    }
  }

  /**
   * Save settings to disk
   */
  private saveSettings(): void {
    try {
      const settingsDir = path.dirname(this.settingsPath);
      if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir, { recursive: true });
      }

      fs.writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2));
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
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
      return (
        typeof settings === 'object' &&
        typeof settings.sleepPreventionMode === 'string' &&
        Object.values(SleepPreventionMode).includes(settings.sleepPreventionMode) &&
        typeof settings.activitySimulation === 'object' &&
        typeof settings.activitySimulation.interval === 'number' &&
        typeof settings.activitySimulation.activityType === 'string' &&
        ['mouse', 'keyboard', 'both'].includes(settings.activitySimulation.activityType)
      );
    } catch {
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
