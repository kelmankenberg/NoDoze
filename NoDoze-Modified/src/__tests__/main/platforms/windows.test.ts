/**
 * Tests for Windows platform implementation
 * Testing the sleep prevention functionality using Electron's powerSaveBlocker API
 */

// Mock Electron's powerSaveBlocker
const mockPowerSaveBlocker = {
  start: jest.fn().mockImplementation((type) => {
    // Return a different ID based on the type
    if (type === 'prevent-display-sleep') return 1;
    if (type === 'prevent-app-suspension') return 2;
    return 0;
  }),
  stop: jest.fn(),
  isStarted: jest.fn().mockReturnValue(true)
};

// Mock Electron module
jest.mock('electron', () => ({
  powerSaveBlocker: mockPowerSaveBlocker,
  app: {}
}));

// Mock child_process for getPowerStatus method
jest.mock('child_process', () => ({
  exec: jest.fn((command, callback) => {
    if (command === 'powercfg /list') {
      callback(null, '* Power Plan (12345678-1234-1234-1234-123456789012)');
    } else if (command === 'WMIC Path Win32_Battery Get BatteryStatus') {
      callback(null, 'BatteryStatus\r\n2'); // 2 means on AC power
    }
  })
}));

import * as windowsImpl from '../../../main/platforms/windows';

describe('Windows Platform Implementation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    
    // Reset mock counters
    mockPowerSaveBlocker.start.mockClear();
    mockPowerSaveBlocker.stop.mockClear();
    
    // Clear all interval timers
    jest.clearAllTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initialize', () => {
    it('should initialize correctly', () => {
      const result = windowsImpl.initialize();
      expect(result).toBe(true);
    });
  });
  describe('preventSleep', () => {
    it('should call powerSaveBlocker.start with correct types', async () => {
      const result = await windowsImpl.preventSleep();
      
      // Verify it was called with both prevent-app-suspension and prevent-display-sleep
      expect(mockPowerSaveBlocker.start).toHaveBeenCalledWith('prevent-app-suspension');
      expect(mockPowerSaveBlocker.start).toHaveBeenCalledWith('prevent-display-sleep');
      expect(result).toBe(true);
    });

    it('should create a timer to log status periodically', async () => {
      await windowsImpl.preventSleep();
      
      // Spy on console.log
      const consoleSpy = jest.spyOn(console, 'log');
      
      // Advance time by default interval (59 seconds)
      jest.advanceTimersByTime(59000);
      
      // Should have logged status message
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('NoDoze: Keeping system awake at'));
      
      // Clean up
      consoleSpy.mockRestore();
    });

    it('should respect the custom interval parameter', async () => {
      const customInterval = 30; // 30 seconds
      await windowsImpl.preventSleep(customInterval);
      
      // Spy on console.log
      const consoleSpy = jest.spyOn(console, 'log');
      
      // Advance time by custom interval
      jest.advanceTimersByTime(30000);
      
      // Should have logged status message
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('NoDoze: Keeping system awake at'));
      
      // Clean up
      consoleSpy.mockRestore();
    });    it('should respect the display sleep parameter', async () => {
      // Prevent system sleep but allow display sleep
      await windowsImpl.preventSleep(59, false);
      
      // Should only call once for prevent-app-suspension, not for prevent-display-sleep
      expect(mockPowerSaveBlocker.start).toHaveBeenCalledTimes(1);
      expect(mockPowerSaveBlocker.start).toHaveBeenCalledWith('prevent-app-suspension');
      expect(mockPowerSaveBlocker.start).not.toHaveBeenCalledWith('prevent-display-sleep');
    });

    it('should track activity state correctly', async () => {
      await windowsImpl.preventSleep();
      expect(windowsImpl.isPreventingSleep()).toBe(true);
      expect(windowsImpl.getLastActivityTime()).toBeInstanceOf(Date);
    });
  });

  describe('allowSleep', () => {
    it('should call powerSaveBlocker.stop to release blockers', async () => {
      // First prevent sleep
      await windowsImpl.preventSleep();
      
      // Reset call count
      mockPowerSaveBlocker.stop.mockClear();
      
      // Then allow sleep
      await windowsImpl.allowSleep();
      
      // Should call stop for both blockers
      expect(mockPowerSaveBlocker.stop).toHaveBeenCalledTimes(2);
    });

    it('should clear the timer', async () => {
      // First prevent sleep
      await windowsImpl.preventSleep();
      
      // Spy on clearInterval
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      
      // Then allow sleep
      await windowsImpl.allowSleep();
      
      // Should call clearInterval
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
    
    it('should update activity state correctly', async () => {
      // First prevent sleep
      await windowsImpl.preventSleep();
      
      // Then allow sleep
      await windowsImpl.allowSleep();
      
      // State should be reset
      expect(windowsImpl.isPreventingSleep()).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('should call allowSleep to reset state and release resources', async () => {
      // First prevent sleep
      await windowsImpl.preventSleep();
      
      // Spy on allowSleep
      const allowSleepSpy = jest.spyOn(windowsImpl, 'allowSleep');
      
      // Call cleanup
      await windowsImpl.cleanup();
      
      // Should call allowSleep
      expect(allowSleepSpy).toHaveBeenCalled();
    });
  });

  describe('getPowerStatus', () => {
    it('should return power information', async () => {
      const status = await windowsImpl.getPowerStatus();
      
      // Based on our mocks, should report on AC power with a power plan
      expect(status.onBattery).toBe(false);
      expect(status.powerPlan).toContain('Power Plan');
    });
  });
});