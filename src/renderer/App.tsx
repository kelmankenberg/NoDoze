import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import './styles.css';
import AboutDialog from './AboutDialog';
import TitleBar from './TitleBar';
import SleepPreventionModeToggle, { SleepPreventionMode } from './SleepPreventionModeToggle';

interface SleepPreventionState {
  mode: SleepPreventionMode;
  systemSleepPrevention: boolean;
  activitySimulation: boolean;
  timerActive: boolean;
  timerDuration: number;
  timeRemaining: number;
}

const App: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timerMode, setTimerMode] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30); // Default 30 minutes
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [sleepPreventionState, setSleepPreventionState] = useState<SleepPreventionState>({
    mode: SleepPreventionMode.FULL,
    systemSleepPrevention: false,
    activitySimulation: false,
    timerActive: false,
    timerDuration: 0,
    timeRemaining: 0
  });
  const [capabilities, setCapabilities] = useState<any>(null);

  // Initialize on component mount
  useEffect(() => {
    // Get initial sleep prevention status
    ipcRenderer.invoke('get-sleep-status').then((status) => {
      setIsActive(status);
    });

    // Get initial sleep prevention state
    ipcRenderer.invoke('get-sleep-prevention-state').then((state) => {
      setSleepPreventionState(state);
    });

    // Get activity simulator capabilities
    ipcRenderer.invoke('get-activity-simulator-capabilities').then((caps) => {
      setCapabilities(caps);
    });

    // Listen for status changes from main process
    ipcRenderer.on('sleep-status-changed', (_, status) => {
      setIsActive(status);
    });

    // Listen for sleep prevention state changes
    ipcRenderer.on('sleep-state-changed', (_, state) => {
      setSleepPreventionState(state);
    });

    // Listen for quick timer settings from the tray menu
    ipcRenderer.on('set-quick-timer', (_, minutes) => {
      setTimerMode(true);
      setTimerDuration(minutes);
      setTimeRemaining(minutes * 60);
    });

    return () => {
      ipcRenderer.removeAllListeners('sleep-status-changed');
      ipcRenderer.removeAllListeners('sleep-state-changed');
      ipcRenderer.removeAllListeners('set-quick-timer');
    };
  }, []);

  // Handle timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerMode && isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleToggle(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerMode, isActive, timeRemaining]);

  const handleToggle = (newState: boolean) => {
    ipcRenderer.send('toggle-sleep-prevention', newState);
    setIsActive(newState);

    if (newState && timerMode) {
      setTimeRemaining(timerDuration * 60); // Convert minutes to seconds
    } else {
      setTimeRemaining(0);
    }
  };

  const handleTimerToggle = () => {
    const newTimerMode = !timerMode;
    setTimerMode(newTimerMode);
    
    if (newTimerMode && isActive) {
      setTimeRemaining(timerDuration * 60);
    }
  };

  const handleTimerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setTimerDuration(value > 0 ? value : 1);
    
    if (timerMode && isActive) {
      setTimeRemaining(value * 60);
    }
  };

  const handleModeChange = async (mode: SleepPreventionMode) => {
    try {
      const result = await ipcRenderer.invoke('set-sleep-prevention-mode', mode);
      if (result.success) {
        setSleepPreventionState(prev => ({ ...prev, mode }));
      } else {
        console.error('Failed to change mode:', result.error);
      }
    } catch (error) {
      console.error('Error changing sleep prevention mode:', error);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get the appropriate button and status colors based on active state
  const getStatusColors = () => {
    if (isActive) {
      return {
        buttonClass: 'active',
        buttonColor: '#2ecc71',
        statusText: 'Sleep prevention enabled',
        statusEmoji: '✅'
      };
    } else {
      return {
        buttonClass: '',
        buttonColor: '#e74c3c',
        statusText: 'Normal sleep mode',
        statusEmoji: '💤'
      };
    }
  };

  const statusColors = getStatusColors();
  
  return (
    <div className="app-container">
      <div className="fixed-header-container">
        <TitleBar title="NoDoze" />
        {/* <header className="app-header">
          <h1>NoDoze</h1>
          <p className="subtitle">Keep your computer awake</p>
        </header> */}
      </div>

      <div className="control-section">
        {/* Activate Button (on top) */}
        <div className="activate-section">
          <button
            className={`activate-button${isActive ? ' active' : ''}`}
            onClick={() => handleToggle(!isActive)}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
          <p className="status-text">
            {statusColors.statusEmoji} {statusColors.statusText}
          </p>
        </div>

        {/* Sleep Prevention Mode Toggle */}
        <div className="mode-toggle-section">
          <SleepPreventionModeToggle
            currentMode={sleepPreventionState.mode}
            onModeChange={handleModeChange}
            disabled={false}
          />
        </div>

        {/* <div className="timer-section">
          <div className="timer-header">
            <h3>Timer Mode</h3>
            <label className="switch">
              <input
                type="checkbox"
                checked={timerMode}
                onChange={handleTimerToggle}
              />
              <span className="slider round"></span>
            </label>
          </div>

          {timerMode && (
            <div className="timer-controls">
              <div className="timer-input">
                <label>Duration (minutes):</label>
                <input
                  type="number"
                  value={timerDuration}
                  onChange={handleTimerChange}
                  min="1"
                  disabled={isActive}
                />
              </div>

              {isActive && timeRemaining > 0 && (
                <div className="timer-display">
                  <p>Time remaining: {formatTime(timeRemaining)}</p>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${(timeRemaining / (timerDuration * 60)) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div> */}
      </div>

      <footer className="app-footer">
        <p>NoDoze v1.0.0</p>
        <div className="footer-actions">
          <button className="link-button" onClick={() => setShowAbout(true)}>
            About
          </button>
          <span className="footer-separator">|</span>
          <small>Close this window to minimize to system tray</small>
        </div>
      </footer>

      {/* About dialog */}
      <AboutDialog
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />
    </div>
  );
};

export default App;