/**
 * Activity Simulator Interface
 * Provides user activity simulation to prevent applications from showing "Away" status
 */

export interface ActivitySimulatorOptions {
  /** Interval between activity simulations in milliseconds */
  interval: number;
  /** Type of activity to simulate */
  activityType: 'mouse' | 'keyboard' | 'both';
  /** Enable debug logging */
  debug?: boolean;
}

export interface ActivitySimulatorCapabilities {
  /** Can simulate mouse movement */
  mouseSimulation: boolean;
  /** Can simulate keyboard input */
  keyboardSimulation: boolean;
  /** Requires elevated permissions */
  requiresElevation: boolean;
  /** Platform-specific limitations */
  limitations: string[];
}

export abstract class ActivitySimulator {
  protected isRunning: boolean = false;
  protected interval: number = 30000; // 30 seconds default
  protected activityType: ActivitySimulatorOptions['activityType'] = 'both';
  protected debug: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(options: Partial<ActivitySimulatorOptions> = {}) {
    this.interval = options.interval || 30000;
    this.activityType = options.activityType || 'both';
    this.debug = options.debug || false;
  }

  /**
   * Start activity simulation
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.log('Starting activity simulation...');
    this.isRunning = true;
    
    // Perform initial activity simulation
    await this.performActivity();
    
    // Set up interval for continuous simulation
    this.intervalId = setInterval(async () => {
      if (this.isRunning) {
        await this.performActivity();
      }
    }, this.interval);
  }

  /**
   * Stop activity simulation
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.log('Stopping activity simulation...');
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Update simulation interval
   */
  setInterval(intervalMs: number): void {
    this.interval = intervalMs;
    
    // Restart with new interval if currently running
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Update activity type
   */
  setActivityType(type: ActivitySimulatorOptions['activityType']): void {
    this.activityType = type;
  }

  /**
   * Get current status
   */
  getStatus(): {
    isRunning: boolean;
    interval: number;
    activityType: string;
  } {
    return {
      isRunning: this.isRunning,
      interval: this.interval,
      activityType: this.activityType
    };
  }

  /**
   * Get platform capabilities
   */
  abstract getCapabilities(): ActivitySimulatorCapabilities;

  /**
   * Perform the actual activity simulation
   */
  protected abstract performActivity(): Promise<void>;

  /**
   * Simulate mouse movement
   */
  protected abstract simulateMouseMovement(): Promise<void>;

  /**
   * Simulate keyboard input
   */
  protected abstract simulateKeyboardInput(): Promise<void>;

  /**
   * Log debug messages
   */
  protected log(message: string): void {
    if (this.debug) {
      console.log(`[ActivitySimulator] ${message}`);
    }
  }

  /**
   * Handle errors gracefully
   */
  protected handleError(error: Error, context: string): void {
    console.error(`[ActivitySimulator] Error in ${context}:`, error);
    // Don't stop the simulation for individual errors
  }
}
