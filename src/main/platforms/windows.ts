/**
 * Windows platform-specific implementation for NoDoze
 * Uses Windows SetThreadExecutionState API to prevent sleep
 */
import { exec } from 'child_process';
import { app } from 'electron';
import * as ffi from 'ffi-napi';
import * as ref from 'ref-napi';

// Define ES_CONTINUOUS and ES_SYSTEM_REQUIRED constants
const ES_CONTINUOUS = 0x80000000;
const ES_SYSTEM_REQUIRED = 0x00000001;
const ES_DISPLAY_REQUIRED = 0x00000002;

let preventSleepTimer: NodeJS.Timeout | null = null;
let intervalSeconds = 59; // Default interval
let isActive = false;
let lastActivityTime: Date | null = null;
let preventDisplaySleep = true; // Default to also prevent display sleep

// Define Windows API functions through FFI
const user32 = ffi.Library('user32', {
  'SetThreadExecutionState': ['uint32', ['uint32']]
});

/**
 * Initialize Windows sleep prevention
 */
export const initialize = (): boolean => {
  // Nothing specific to initialize for Windows
  return true;
};

/**
 * Prevent the system from going to sleep
 * Uses the Windows SetThreadExecutionState API
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
    if (preventSleepTimer) {
      clearInterval(preventSleepTimer);
      preventSleepTimer = null;
    }
    
    // Reset the execution state to default (allow sleep)
    user32.SetThreadExecutionState(ES_CONTINUOUS);
    
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