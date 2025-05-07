// Mock Electron API for tests

// Store IPC handlers for testing
const ipcHandlers = new Map();
// Track sleep prevention status
let sleepPrevented = false;

const mockIpcMain = {
  on: jest.fn((channel, handler) => {
    ipcHandlers.set(`on:${channel}`, handler);
    return mockIpcMain;
  }),
  once: jest.fn((channel, handler) => {
    ipcHandlers.set(`once:${channel}`, handler);
    return mockIpcMain;
  }),
  handle: jest.fn((channel, handler) => {
    ipcHandlers.set(`handle:${channel}`, handler);
    return mockIpcMain;
  }),
  removeAllListeners: jest.fn(),
  removeHandler: jest.fn()
};

const mockIpcRenderer = {
  on: jest.fn(),
  once: jest.fn(),
  send: jest.fn((channel, ...args) => {
    // Find matching handler for 'on' or 'once' events
    const handler = ipcHandlers.get(`on:${channel}`) || ipcHandlers.get(`once:${channel}`);
    if (handler) {
      handler({ sender: mockIpcRenderer }, ...args);
    }
  }),
  invoke: jest.fn((channel, ...args) => {
    // Find matching handler for 'handle' events
    const handler = ipcHandlers.get(`handle:${channel}`);
    if (handler) {
      return Promise.resolve(handler({ sender: mockIpcRenderer }, ...args));
    }
    return Promise.resolve(false);
  }),
  removeAllListeners: jest.fn()
};

// Store the ready callback so tests can invoke it
let readyCallback = null;

const mockApp = {
  getPath: jest.fn(pathName => {
    if (pathName === 'exe') return '/mock/path/to/exe';
    return '/mock/path';
  }),
  getLoginItemSettings: jest.fn(() => ({ openAtLogin: false })),
  setLoginItemSettings: jest.fn(),
  whenReady: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  on: jest.fn((event, handler) => {
    if (event === 'before-quit') {
      mockApp._beforeQuitHandler = handler;
    }
    if (event === 'ready') {
      readyCallback = handler;
      // Immediately execute ready callback to simulate app being ready
      setTimeout(() => handler(), 0);
    }
    return mockApp;
  }),
  isPackaged: false,
  quit: jest.fn(),
  _beforeQuitHandler: null, // Store for testing
  _triggerBeforeQuit: () => {
    if (mockApp._beforeQuitHandler) {
      return mockApp._beforeQuitHandler();
    }
    return Promise.resolve();
  },
  // Manually trigger the app ready event
  _triggerReady: () => {
    if (readyCallback) {
      return readyCallback();
    }
    return Promise.resolve();
  }
};

// Mock child process
class MockChildProcess {
  constructor() {
    this.eventHandlers = {};
    this.stdout = { on: jest.fn() };
    this.stderr = { on: jest.fn() };
  }

  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
    return this;
  }

  emit(event, ...args) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => handler(...args));
    }
    return true;
  }
}

const mockChildProcess = {
  spawn: jest.fn(() => {
    const proc = new MockChildProcess();
    mockChildProcess._lastProcess = proc;
    return proc;
  }),
  _lastProcess: null, // Store for testing
  exec: jest.fn((command, options, callback) => {
    if (typeof options === 'function') {
      callback = options;
    }
    if (callback) {
      callback(null, { stdout: 'mock stdout', stderr: 'mock stderr' });
    }
    return { on: jest.fn() };
  })
};

// Mock powerSaveBlocker
const mockPowerSaveBlocker = {
  start: jest.fn(() => {
    sleepPrevented = true;
    return 1; // Mock ID
  }),
  stop: jest.fn(() => {
    sleepPrevented = false;
    return true;
  }),
  isStarted: jest.fn(() => sleepPrevented)
};

// Mock BrowserWindow
const mockBrowserWindow = jest.fn().mockImplementation(() => {
  return {
    loadFile: jest.fn().mockResolvedValue(undefined),
    webContents: {
      on: jest.fn(),
      send: jest.fn()
    },
    on: jest.fn(),
    once: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    isVisible: jest.fn(),
    close: jest.fn(),
    destroy: jest.fn()
  };
});

// Mock Tray
const mockTray = jest.fn().mockImplementation(() => {
  return {
    on: jest.fn(),
    setImage: jest.fn(),
    setToolTip: jest.fn(),
    setContextMenu: jest.fn(),
    destroy: jest.fn()
  };
});

// Mock Menu
const mockMenu = {
  buildFromTemplate: jest.fn(template => template)
};

// Export the mock electron
module.exports = {
  app: mockApp,
  BrowserWindow: mockBrowserWindow,
  ipcMain: mockIpcMain,
  ipcRenderer: mockIpcRenderer,
  Menu: mockMenu,
  Tray: mockTray,
  powerSaveBlocker: mockPowerSaveBlocker,
  // Testing utilities
  __resetMocks: () => {
    ipcHandlers.clear();
    sleepPrevented = false;
    readyCallback = null;
    mockApp._beforeQuitHandler = null;
    mockChildProcess._lastProcess = null;
    
    // Reset all mocks
    jest.clearAllMocks();
  },
  // Expose mocks for additional testing
  __mocks: {
    mockApp,
    mockIpcMain,
    mockIpcRenderer,
    ipcHandlers,
    childProcess: mockChildProcess
  }
};

// Mock the child_process module
jest.mock('child_process', () => mockChildProcess);