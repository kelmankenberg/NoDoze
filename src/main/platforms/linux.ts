/**
 * Linux platform-specific implementation for NoDoze
 * Uses a combination of dbus and xdg-screensaver commands to prevent sleep
 */
import { exec, spawn, ChildProcess } from 'child_process';

let inhibitCookie: string | null = null;
let screenSaverProcess: ChildProcess | null = null;

/**
 * Initialize Linux sleep prevention systems
 */
export const initialize = (): boolean => {
  // Nothing specific to initialize for Linux
  return true;
};

/**
 * Run a command and return its output
 */
const executeCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
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
export const preventSleep = async (): Promise<boolean> => {
  if (inhibitCookie || screenSaverProcess) {
    return true; // Already preventing sleep
  }

  try {
    // Try using dbus-send to inhibit sleep via org.freedesktop.PowerManagement
    try {
      const result = await executeCommand(
        'dbus-send --system --print-reply --dest="org.freedesktop.login1" ' +
        '/org/freedesktop/login1 org.freedesktop.login1.Manager.Inhibit ' +
        'string:"sleep" string:"NoDoze" string:"Preventing system sleep" ' +
        'string:"block"'
      );
      
      // Extract the inhibit cookie from dbus reply
      const match = result.match(/uint32 (\d+)/);
      if (match && match[1]) {
        inhibitCookie = match[1];
        console.log(`Linux sleep inhibitor enabled (cookie: ${inhibitCookie})`);
      }
    } catch (dbusError) {
      console.warn('Failed to inhibit sleep via dbus:', dbusError);
    }
    
    // Also use xdg-screensaver to prevent screen blanking
    // This is a fallback method which works on most desktop environments
    screenSaverProcess = spawn('xdg-screensaver', ['suspend', 'nodoze']);
    screenSaverProcess.on('error', (err) => {
      console.error('xdg-screensaver error:', err);
      screenSaverProcess = null;
    });
    
    console.log('Linux sleep prevention enabled');
    return true;
    
  } catch (error) {
    console.error('Failed to prevent sleep on Linux:', error);
    return false;
  }
};

/**
 * Allow the system to sleep normally
 */
export const allowSleep = async (): Promise<boolean> => {
  try {
    // Release D-Bus inhibitor if we have one
    if (inhibitCookie) {
      try {
        await executeCommand(
          'dbus-send --system --print-reply --dest="org.freedesktop.login1" ' +
          `/org/freedesktop/login1 org.freedesktop.login1.Manager.UnInhibit ` +
          `uint32:${inhibitCookie}`
        );
      } catch (dbusError) {
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
      } catch (error) {
        console.warn('xdg-screensaver resume warning:', error);
      }
    }
    
    console.log('Linux sleep prevention disabled');
    return true;
  } catch (error) {
    console.error('Failed to restore sleep settings on Linux:', error);
    return false;
  }
};

/**
 * Clean up resources
 */
export const cleanup = async (): Promise<void> => {
  try {
    await allowSleep();
  } catch (error) {
    console.error('Error during Linux cleanup:', error);
  }
  
  inhibitCookie = null;
  if (screenSaverProcess) {
    screenSaverProcess.kill();
    screenSaverProcess = null;
  }
};