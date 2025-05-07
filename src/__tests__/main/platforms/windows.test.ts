/**
 * Tests for Windows platform implementation
 * Testing the sleep prevention functionality using SetThreadExecutionState API
 */

// Mock ffi-napi and ref-napi modules
jest.mock('ffi-napi', () => ({
  Library: jest.fn().mockImplementation(() => ({
    SetThreadExecutionState: jest.fn().mockImplementation((flags) => {
      // Return a successful result (non-zero)
      return 1;
    })
  }))
}));

jest.mock('ref-napi');

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

const ffi = require('ffi-napi');
import * as windowsImpl from '../../../main/platforms/windows';

describe('Windows Platform Implementation', () => {
  let mockSetThreadExecutionState;
  
  beforeEach(() => {
    jest.useFakeTimers();
    
    // Get access to the mocked SetThreadExecutionState function for assertions
    mockSetThreadExecutionState = ffi.Library().SetThreadExecutionState;
    
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
    it('should call SetThreadExecutionState with correct flags', async () => {
      const result = await windowsImpl.preventSleep();
      
      // Verify it was called with ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED
      // These values are defined in the windows.ts file
      const expectedFlags = 0x80000000 | 0x00000001 | 0x00000002;
      expect(mockSetThreadExecutionState).toHaveBeenCalledWith(expectedFlags);
      expect(result).toBe(true);
    });

    it('should create a timer to refresh the state periodically', async () => {
      await windowsImpl.preventSleep();
      
      // Initially called once
      expect(mockSetThreadExecutionState).toHaveBeenCalledTimes(1);
      
      // Clear previous calls
      mockSetThreadExecutionState.mockClear();
      
      // Advance time by default interval (59 seconds)
      jest.advanceTimersByTime(59000);
      
      // Should be called again after the timer fires
      expect(mockSetThreadExecutionState).toHaveBeenCalledTimes(1);
    });

    it('should respect the custom interval parameter', async () => {
      const customInterval = 30; // 30 seconds
      await windowsImpl.preventSleep(customInterval);
      
      // Initially called once
      expect(mockSetThreadExecutionState).toHaveBeenCalledTimes(1);
      
      // Clear previous calls
      mockSetThreadExecutionState.mockClear();
      
      // Advance time by custom interval
      jest.advanceTimersByTime(30000);
      
      // Should be called again after the timer fires
      expect(mockSetThreadExecutionState).toHaveBeenCalledTimes(1);
    });

    it('should respect the display sleep parameter', async () => {
      // Prevent system sleep but allow display sleep
      await windowsImpl.preventSleep(59, false);
      
      // Should call with ES_CONTINUOUS | ES_SYSTEM_REQUIRED only
      const expectedFlags = 0x80000000 | 0x00000001; // ES_CONTINUOUS | ES_SYSTEM_REQUIRED
      expect(mockSetThreadExecutionState).toHaveBeenCalledWith(expectedFlags);
    });

    it('should track activity state correctly', async () => {
      await windowsImpl.preventSleep();
      expect(windowsImpl.isPreventingSleep()).toBe(true);
      expect(windowsImpl.getLastActivityTime()).toBeInstanceOf(Date);
    });
  });

  describe('allowSleep', () => {
    it('should call SetThreadExecutionState to reset state', async () => {
      // First prevent sleep
      await windowsImpl.preventSleep();
      
      // Reset call count
      mockSetThreadExecutionState.mockClear();
      
      // Then allow sleep
      await windowsImpl.allowSleep();
      
      // Should call with ES_CONTINUOUS only to reset state
      expect(mockSetThreadExecutionState).toHaveBeenCalledWith(0x80000000); // ES_CONTINUOUS
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