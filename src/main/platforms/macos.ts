/**
 * macOS platform-specific implementation for NoDoze
 * Uses IOKit power assertions to prevent sleep
 */
import { exec } from 'child_process';

let assertionId: string | null = null;

/**
 * Initialize macOS sleep prevention
 */
export const initialize = (): boolean => {
  // Nothing specific to initialize for macOS
  return true;
};

/**
 * Helper function to execute macOS caffeinate command
 */
const executeCaffeinate = (args: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(`caffeinate ${args}`, (error, stdout, stderr) => {
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
export const preventSleep = async (): Promise<boolean> => {
  if (assertionId) {
    return true; // Already preventing sleep
  }

  try {
    // Start caffeinate in background mode to prevent display and system sleep
    // -d prevents display sleep, -i prevents idle sleep
    assertionId = await executeCaffeinate('-d -i &');
    console.log(`Sleep prevention enabled on macOS (PID: ${assertionId})`);
    return true;
  } catch (error) {
    console.error('Failed to prevent sleep on macOS:', error);
    return false;
  }
};

/**
 * Allow the system to sleep normally
 * Terminates the caffeinate process
 */
export const allowSleep = async (): Promise<boolean> => {
  if (!assertionId) {
    return true; // Nothing to restore
  }

  try {
    // Kill the caffeinate process
    await executeCaffeinate(`kill ${assertionId}`);
    console.log('Sleep prevention disabled on macOS');
    assertionId = null;
    return true;
  } catch (error) {
    console.error('Failed to restore sleep settings on macOS:', error);
    return false;
  }
};

/**
 * Clean up resources
 */
export const cleanup = async (): Promise<void> => {
  if (assertionId) {
    try {
      await allowSleep();
    } catch (error) {
      console.error('Error during macOS cleanup:', error);
    }
    assertionId = null;
  }
};