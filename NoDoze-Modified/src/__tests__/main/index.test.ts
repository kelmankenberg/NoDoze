const path = require('path');
const electron = require('electron');
const { initialize, preventSleep, allowSleep, cleanup } = require('../../main/platforms/windows');

// Mock the modules we need
jest.mock('electron');
jest.mock('path');
jest.mock('../../main/platforms/windows');
jest.mock('../../main/platforms/macos');
jest.mock('../../main/platforms/linux');

// Helper to import the main process module with mocks ready
const importMain = async () => {
  // Clear the module cache to ensure we get a fresh instance
  jest.resetModules();
  
  // Return the imported module
  return await require('../../main/index');
};

describe('Main Process', () => {
  let mockPlatformImpl;
  let mainModule;
  
  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Mock path.join to return predictable paths
    path.join.mockImplementation((...args) => args.join('/'));
    
    // Setup platform implementation mock
    mockPlatformImpl = {
      initialize: jest.fn().mockReturnValue(true),
      preventSleep: jest.fn().mockResolvedValue(true),
      allowSleep: jest.fn().mockResolvedValue(true),
      cleanup: jest.fn().mockResolvedValue(true)
    };
    
    // For testing purposes, we'll use the Windows implementation
    Object.defineProperty(process, 'platform', { value: 'win32' });
    jest.mock('../../main/platforms/windows', () => ({
      initialize: mockPlatformImpl.initialize,
      preventSleep: mockPlatformImpl.preventSleep,
      allowSleep: mockPlatformImpl.allowSleep,
      cleanup: mockPlatformImpl.cleanup
    }));
    
    // Import the main module
    mainModule = await importMain();
  });
  
  afterEach(() => {
    // Restore process.platform
    //Object.defineProperty(process, 'platform', { value: process.platform });
  });

  describe('App initialization', () => {
    it('should initialize platform, create window and tray when app is ready', async () => {
      // Get and call the ready callback using our helper function
      const readyCallback = electron._getReadyCallback();
      expect(readyCallback).not.toBeNull();
      
      // Call the ready callback
      await readyCallback();
      
      // Check that platform was initialized - this should be looking at our mock, not the real implementation
      expect(mockPlatformImpl.initialize).toHaveBeenCalled();
      
      // Check that window and tray were created
      expect(electron.BrowserWindow).toHaveBeenCalled();
      expect(electron.Tray).toHaveBeenCalled();
    });
  });

  describe('IPC Communication', () => {
    it('should handle toggle-sleep-prevention event', async () => {
      // Get the IPC handlers from our mock
      const ipcHandlers = electron._getIpcHandlers();
      
      // Find the toggle handler
      const toggleHandler = ipcHandlers.find(handler => handler[0] === 'on' && handler[1] === 'toggle-sleep-prevention');
      expect(toggleHandler).toBeDefined();
      
      const handler = toggleHandler[2];
      
      // Test preventing sleep
      await handler({}, true);
      expect(mockPlatformImpl.preventSleep).toHaveBeenCalled();
      
      // Test allowing sleep
      mockPlatformImpl.preventSleep.mockClear();
      await handler({}, false);
      expect(mockPlatformImpl.allowSleep).toHaveBeenCalled();
    });
    
    it('should handle get-sleep-status request', async () => {
      // Get the IPC handlers
      const ipcHandlers = electron._getIpcHandlers();
      
      // Find the status handler
      const statusHandler = ipcHandlers.find(handler => handler[0] === 'get-sleep-status');
      expect(statusHandler).toBeDefined();
      
      const handler = statusHandler[1];
      
      // Test the handler returns the correct sleep status (initially false)
      const result = await handler({});
      expect(result).toBe(false);
    });
  });
  
  describe('Tray functionality', () => {
    it('should create a tray with appropriate icon', async () => {
      // Get and call the ready callback using our helper function
      const readyCallback = electron._getReadyCallback();
      expect(readyCallback).not.toBeNull();
      
      // Call the ready callback
      await readyCallback();
      
      // Check tray was created with appropriate parameters
      expect(electron.nativeImage.createFromPath).toHaveBeenCalled();
      expect(electron.Tray).toHaveBeenCalled();
    });
    
    it('should build context menu with appropriate options', async () => {
      // Get and call the ready callback using our helper function
      const readyCallback = electron._getReadyCallback();
      expect(readyCallback).not.toBeNull();
      
      // Call the ready callback
      await readyCallback();
      
      // Check menu was built from template
      expect(electron.Menu.buildFromTemplate).toHaveBeenCalled();
      
      // Get the template from our mock
      const template = electron.Menu._template;
      
      // Check for key menu items
      const openMenuItem = template.find(item => item.label === 'Open NoDoze');
      const preventSleepMenuItem = template.find(item => item.label === 'Prevent Sleep');
      const quickTimerMenu = template.find(item => item.label === 'Quick Timer');
      const quitMenuItem = template.find(item => item.label === 'Quit');
      
      expect(openMenuItem).toBeDefined();
      expect(preventSleepMenuItem).toBeDefined();
      expect(quickTimerMenu).toBeDefined();
      expect(quitMenuItem).toBeDefined();
    });
  });
  
  describe('Cleanup on quit', () => {
    it('should perform cleanup when app is about to quit', async () => {
      // Get the quit handler
      const quitHandlers = electron.app.on.mock.calls;
      const beforeQuitHandler = quitHandlers.find(call => call[0] === 'before-quit');
      expect(beforeQuitHandler).toBeDefined();
      
      const handler = beforeQuitHandler[1];
      
      // Create a spy to watch for allowSleep calls
      const allowSleepSpy = jest.spyOn(mockPlatformImpl, 'allowSleep');
      const cleanupSpy = jest.spyOn(mockPlatformImpl, 'cleanup');
      
      // Call the handler
      await handler();
      
      // Check that cleanup was performed
      expect(allowSleepSpy).toHaveBeenCalled();
      expect(cleanupSpy).toHaveBeenCalled();
    });
  });
});