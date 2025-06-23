// Mock Electron API for tests

// Store IPC handlers for testing
const ipcHandlers = new Map<string, any>();
// Track sleep prevention status
let sleepPrevented = false;

interface IpcMainInterface {
  on: jest.Mock;
  once: jest.Mock;
  handle: jest.Mock;
  removeAllListeners: jest.Mock;
  removeHandler: jest.Mock;
}

const mockIpcMain: IpcMainInterface = {
  on: jest.fn((channel: string, handler: (event: any, ...args: any[]) => void) => {
    ipcHandlers.set(`on:${channel}`, handler);
    return mockIpcMain;
  }),
  once: jest.fn((channel: string, handler: (event: any, ...args: any[]) => void) => {
    ipcHandlers.set(`once:${channel}`, handler);
    return mockIpcMain;
  }),
  handle: jest.fn((channel: string, handler: (event: any, ...args: any[]) => any) => {
    ipcHandlers.set(`handle:${channel}`, handler);
    return mockIpcMain;
  }),
  removeAllListeners: jest.fn(),
  removeHandler: jest.fn()
};

interface IpcRendererInterface {
  on: jest.Mock;
  once: jest.Mock;
  send: jest.Mock;
  invoke: jest.Mock;
  removeAllListeners: jest.Mock;
}

const mockIpcRenderer: IpcRendererInterface = {
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
let readyCallback: (() => void) | null = null;

interface AppInterface {
  getPath: jest.Mock;
  getLoginItemSettings: jest.Mock;
  setLoginItemSettings: jest.Mock;
  whenReady: jest.Mock;
  on: jest.Mock;
  _beforeQuitHandler?: () => void;
  [key: string]: any; // For other properties that might be accessed
}

const mockApp: AppInterface = {
  getPath: jest.fn((pathName: string) => {
    if (pathName === 'exe') return '/mock/path/to/exe';
    return '/mock/path';
  }),
  getLoginItemSettings: jest.fn(() => ({ openAtLogin: false })),
  setLoginItemSettings: jest.fn(),
  whenReady: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  on: jest.fn((event: string, handler: () => void) => {
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
  _beforeQuitHandler: undefined, // Store for testing
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
interface IEventHandlers {
  [key: string]: Array<((...args: any[]) => void)>;
}

class MockChildProcess {
  eventHandlers: IEventHandlers;
  stdout: { on: jest.Mock };
  stderr: { on: jest.Mock };

  constructor() {
    this.eventHandlers = {};
    this.stdout = { on: jest.fn() };
    this.stderr = { on: jest.fn() };
  }

  on(event: string, handler: (...args: any[]) => void): MockChildProcess {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach((handler: (...args: any[]) => void) => handler(...args));
    }
    return true;
  }
}

interface ChildProcessInterface {
  spawn: jest.Mock;
  _lastProcess?: MockChildProcess;
  [key: string]: any;
}

const mockChildProcess: ChildProcessInterface = {
  spawn: jest.fn(() => {
    const proc = new MockChildProcess();
    mockChildProcess._lastProcess = proc;
    return proc;
  }),
  _lastProcess: undefined, // Store for testing
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
    readyCallback = null as unknown as (() => void) | null;    mockApp._beforeQuitHandler = undefined;
    mockChildProcess._lastProcess = undefined;
    
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