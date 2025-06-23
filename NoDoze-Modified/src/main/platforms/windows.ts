/**
 * Windows platform-specific implementation for NoDoze
 * Uses Electron's built-in powerSaveBlocker API to prevent sleep
 */
import { exec } from 'child_process';
import { app, powerSaveBlocker } from 'electron';

// Track state
let intervalSeconds = 59; // Default interval
let isActive = false;
let lastActivityTime: Date | null = null;
let preventDisplaySleep = true; // Default to also prevent display sleep
let statusLogTimer: NodeJS.Timeout | null = null;

// Track blockers
let displayBlockerId: number = -1;
let systemBlockerId: number = -1;

/**
 * Initialize Windows sleep prevention
 */
export const initialize = (): boolean => {
  // Nothing specific to initialize for Windows
  return true;
};

/**
 * Prevent the system from going to sleep
 * Uses Electron's powerSaveBlocker API
 * @param seconds Optional parameter to set the interval in seconds (default: 59)
 * @param keepDisplayOn Optional parameter to also keep the display on (default: true)
 */
export const preventSleep = async (seconds: number = 59, keepDisplayOn: boolean = true): Promise<boolean> => {
  try {
    // Kill any existing process first
    await allowSleep();
    
    // Store the settings
    intervalSeconds = seconds;
    preventDisplaySleep = keepDisplayOn;

    // Start system sleep prevention
    systemBlockerId = powerSaveBlocker.start('prevent-app-suspension');
    
    // Also prevent display sleep if requested
    if (keepDisplayOn) {
      displayBlockerId = powerSaveBlocker.start('prevent-display-sleep');
    }
    
    // Create a timer to log status periodically (actual prevention is handled by powerSaveBlocker)
    statusLogTimer = setInterval(() => {
      console.log(`NoDoze: Keeping system awake at ${new Date().toISOString()}`);
    }, seconds * 1000);
    
    // Track activity status and time
    isActive = true;
    lastActivityTime = new Date();
    
    return true;
  } catch (error) {
    console.error('Failed to prevent sleep:', error);
    isActive = false;
    return false;
  }
};

/**
 * Allow the system to go to sleep by stopping the sleep prevention
 */
export const allowSleep = async (): Promise<boolean> => {
  try {
    if (statusLogTimer) {
      clearInterval(statusLogTimer);
      statusLogTimer = null;
    }
    
    // Stop the power save blockers
    if (displayBlockerId !== -1 && powerSaveBlocker.isStarted(displayBlockerId)) {
      powerSaveBlocker.stop(displayBlockerId);
      displayBlockerId = -1;
    }
    
    if (systemBlockerId !== -1 && powerSaveBlocker.isStarted(systemBlockerId)) {
      powerSaveBlocker.stop(systemBlockerId);
      systemBlockerId = -1;
    }
    
    isActive = false;
    return true;
  } catch (error) {
    console.error('Failed to allow sleep:', error);
    return false;
  }
};

/**
 * Clean up resources before application exit
 */
export const cleanup = async (): Promise<boolean> => {
  return await allowSleep();
};

/**
 * Check if sleep prevention is active
 */
export const isPreventingSleep = (): boolean => {
  return isActive;
};

/**
 * Get the current interval setting in seconds
 */
export const getInterval = (): number => {
  return intervalSeconds;
};

/**
 * Get whether display sleep is also being prevented
 */
export const isPreventingDisplaySleep = (): boolean => {
  return preventDisplaySleep;
};

/**
 * Get the timestamp of the last activity
 */
export const getLastActivityTime = (): Date | null => {
  return lastActivityTime;
};

/**
 * Check the system's current power status
 * Returns information about battery/AC power and current power plan
 */
export const getPowerStatus = async (): Promise<{onBattery: boolean, powerPlan: string}> => {
  return new Promise((resolve, reject) => {
    exec('powercfg /list', (error, stdout) => {
      if (error) {
        console.error('Error getting power status:', error);
        resolve({ onBattery: false, powerPlan: 'Unknown' });
        return;
      }

      // Get power plan info
      const activePlanMatch = stdout.match(/\* (.*?) \((.*?)\)/);
      const powerPlan = activePlanMatch ? activePlanMatch[1] : 'Unknown';
      
      // Check if system is on battery
      exec('WMIC Path Win32_Battery Get BatteryStatus', (err, output) => {
        // BatteryStatus = 1 means on battery, 2 means on AC power
        // If there's no battery or an error, assume AC power
        const onBattery = !err && output.includes('1');
        resolve({ onBattery, powerPlan });
      });
    });
  });
};