const React = require('react');
const { render, screen, fireEvent, act } = require('@testing-library/react');

// Mock css import
jest.mock('../../renderer/styles.css', () => ({}), { virtual: true });

// Mock the electron module
jest.mock('electron', () => ({
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn(),
    invoke: jest.fn(),
    removeAllListeners: jest.fn(),
  }
}));

const { ipcRenderer } = require('electron');
const App = require('../../renderer/App').default;

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the initial sleep status response
    ipcRenderer.invoke.mockImplementation((channel) => {
      if (channel === 'get-sleep-status') {
        return Promise.resolve(false);
      }
      return Promise.resolve();
    });
  });

  it('renders correctly with initial state', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Check that the main elements are rendered
    expect(screen.getByText('NoDoze')).toBeInTheDocument();
    expect(screen.getByText('Keep your computer awake')).toBeInTheDocument();
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
    // Use a function to match text that might be split by emoji
    expect(screen.getByText((content) => content.includes('Normal sleep mode'))).toBeInTheDocument();
    expect(screen.getByText('Timer Mode')).toBeInTheDocument();
  });

  it('toggles sleep prevention when clicking the toggle button', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Find and click the toggle button
    const toggleButton = screen.getByText('INACTIVE');
    fireEvent.click(toggleButton);
    
    // Check that IPC was called correctly
    expect(ipcRenderer.send).toHaveBeenCalledWith('toggle-sleep-prevention', true);
  });

  it('toggles timer mode when clicking the switch', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Find and click the timer mode switch
    const timerSwitch = screen.getByRole('checkbox');
    fireEvent.click(timerSwitch);
    
    // Timer input should be visible now
    expect(screen.getByText('Duration (minutes):')).toBeInTheDocument();
  });

  it('changes timer duration when updating the input', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Enable timer mode
    const timerSwitch = screen.getByRole('checkbox');
    fireEvent.click(timerSwitch);
    
    // Find the timer duration input and change its value
    const durationInput = screen.getByRole('spinbutton');
    fireEvent.change(durationInput, { target: { value: '45' } });
    
    // Check that the input value was updated
    expect(durationInput).toHaveValue(45);
  });

  it('responds to IPC sleep status changes', async () => {
    // Setup the IPC handler before rendering
    let sleepStatusHandler;
    
    ipcRenderer.on.mockImplementation((channel, handler) => {
      if (channel === 'sleep-status-changed') {
        sleepStatusHandler = handler;
      }
      return { removeListener: jest.fn() };
    });
    
    await act(async () => {
      render(<App />);
    });
    
    // Initially inactive
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
    
    // Simulate IPC event to activate
    act(() => {
      sleepStatusHandler({}, true);
    });
    
    // Should now be active
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    // Use function to match text that might be split by emoji
    expect(screen.getByText((content) => content.includes('Sleep prevention enabled'))).toBeInTheDocument();
  });

  it('responds to quick timer settings from IPC', async () => {
    // Setup the IPC handlers
    let quickTimerHandler;
    
    ipcRenderer.on.mockImplementation((channel, handler) => {
      if (channel === 'set-quick-timer') {
        quickTimerHandler = handler;
      }
      return { removeListener: jest.fn() };
    });
    
    await act(async () => {
      render(<App />);
    });
    
    // Timer mode should be off initially
    const timerSwitch = screen.getByRole('checkbox');
    expect(timerSwitch).not.toBeChecked();
    
    // Simulate IPC event for quick timer
    act(() => {
      quickTimerHandler({}, 15);
    });
    
    // Timer mode should now be on
    expect(timerSwitch).toBeChecked();
    
    // And duration should be set to 15
    const durationInput = screen.getByRole('spinbutton');
    expect(durationInput).toHaveValue(15);
  });

  it('opens the About dialog when clicking the About link', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Initially the About dialog should not be visible
    expect(screen.queryByText('About NoDoze')).not.toBeInTheDocument();
    
    // Click the About link
    const aboutLink = screen.getByText('About');
    fireEvent.click(aboutLink);
    
    // The About dialog should now be visible
    expect(screen.getByText('About NoDoze')).toBeInTheDocument();
  });

  it('closes the About dialog when clicking the close button', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Open the About dialog
    const aboutLink = screen.getByText('About');
    fireEvent.click(aboutLink);
    
    // Find and click the close button
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    // The About dialog should no longer be visible
    expect(screen.queryByText('About NoDoze')).not.toBeInTheDocument();
  });
});