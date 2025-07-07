/**
 * Sleep Prevention Modes
 * Defines different levels of system and activity management
 */

export enum SleepPreventionMode {
  /** Basic sleep prevention - only prevents system sleep */
  BASIC = 'basic',
  /** Full prevention - prevents sleep AND simulates activity */
  FULL = 'full',
  /** Activity only - simulates activity without preventing sleep */
  ACTIVITY_ONLY = 'activity-only'
}

export interface SleepPreventionState {
  /** Current sleep prevention mode */
  mode: SleepPreventionMode;
  /** Whether system sleep prevention is active */
  systemSleepPrevention: boolean;
  /** Whether activity simulation is active */
  activitySimulation: boolean;
  /** Whether timer is running */
  timerActive: boolean;
  /** Timer duration in minutes */
  timerDuration: number;
  /** Time remaining in seconds */
  timeRemaining: number;
}

export interface SleepPreventionConfig {
  /** Default mode to use on startup */
  defaultMode: SleepPreventionMode;
  /** Activity simulation interval in milliseconds */
  activityInterval: number;
  /** Activity simulation type */
  activityType: 'mouse' | 'keyboard' | 'both';
  /** Enable debug logging */
  debug: boolean;
}

export class SleepPreventionManager {
  private state: SleepPreventionState = {
    mode: SleepPreventionMode.FULL,
    systemSleepPrevention: false,
    activitySimulation: false,
    timerActive: false,
    timerDuration: 0,
    timeRemaining: 0
  };

  private config: SleepPreventionConfig = {
    defaultMode: SleepPreventionMode.FULL,
    activityInterval: 30000, // 30 seconds
    activityType: 'both',
    debug: false
  };

  private listeners: Array<(state: SleepPreventionState) => void> = [];

  constructor(config: Partial<SleepPreventionConfig> = {}) {
    this.config = { ...this.config, ...config };
    this.state.mode = this.config.defaultMode;
  }

  /**
   * Get current state
   */
  getState(): SleepPreventionState {
    return { ...this.state };
  }

  /**
   * Get current configuration
   */
  getConfig(): SleepPreventionConfig {
    return { ...this.config };
  }

  /**
   * Set sleep prevention mode
   */
  setMode(mode: SleepPreventionMode): void {
    if (this.state.mode === mode) {
      return;
    }

    this.state.mode = mode;
    this.notifyListeners();
  }

  /**
   * Update system sleep prevention state
   */
  setSystemSleepPrevention(active: boolean): void {
    if (this.state.systemSleepPrevention === active) {
      return;
    }

    this.state.systemSleepPrevention = active;
    this.notifyListeners();
  }

  /**
   * Update activity simulation state
   */
  setActivitySimulation(active: boolean): void {
    if (this.state.activitySimulation === active) {
      return;
    }

    this.state.activitySimulation = active;
    this.notifyListeners();
  }

  /**
   * Update timer state
   */
  setTimerState(active: boolean, duration: number = 0, remaining: number = 0): void {
    this.state.timerActive = active;
    this.state.timerDuration = duration;
    this.state.timeRemaining = remaining;
    this.notifyListeners();
  }

  /**
   * Update timer countdown
   */
  updateTimeRemaining(seconds: number): void {
    this.state.timeRemaining = seconds;
    this.notifyListeners();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SleepPreventionConfig>): void {
    this.config = { ...this.config, ...config };
    this.notifyListeners();
  }

  /**
   * Add state change listener
   */
  addListener(listener: (state: SleepPreventionState) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove state change listener
   */
  removeListener(listener: (state: SleepPreventionState) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (error) {
        console.error('Error notifying state listener:', error);
      }
    });
  }

  /**
   * Get mode description for UI
   */
  getModeDescription(mode: SleepPreventionMode): string {
    switch (mode) {
      case SleepPreventionMode.BASIC:
        return 'Prevents system sleep only';
      case SleepPreventionMode.FULL:
        return 'Prevents sleep + simulates activity';
      case SleepPreventionMode.ACTIVITY_ONLY:
        return 'Simulates activity only';
      default:
        return 'Unknown mode';
    }
  }

  /**
   * Get mode display name
   */
  getModeDisplayName(mode: SleepPreventionMode): string {
    switch (mode) {
      case SleepPreventionMode.BASIC:
        return 'Basic';
      case SleepPreventionMode.FULL:
        return 'Full';
      case SleepPreventionMode.ACTIVITY_ONLY:
        return 'Activity';
      default:
        return 'Unknown';
    }
  }

  /**
   * Check if mode should prevent system sleep
   */
  shouldPreventSystemSleep(mode: SleepPreventionMode): boolean {
    return mode === SleepPreventionMode.BASIC || mode === SleepPreventionMode.FULL;
  }

  /**
   * Check if mode should simulate activity
   */
  shouldSimulateActivity(mode: SleepPreventionMode): boolean {
    return mode === SleepPreventionMode.FULL || mode === SleepPreventionMode.ACTIVITY_ONLY;
  }
}
