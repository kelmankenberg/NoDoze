/**
 * Activity Simulator Factory
 * Creates the appropriate activity simulator based on the current platform
 */

import { ActivitySimulator, ActivitySimulatorOptions } from './ActivitySimulator';
import { WindowsActivitySimulator } from './WindowsActivitySimulator';
import { MacOSActivitySimulator } from './MacOSActivitySimulator';
import { LinuxActivitySimulator } from './LinuxActivitySimulator';

export class ActivitySimulatorFactory {
  /**
   * Create activity simulator for current platform
   */
  static create(options: Partial<ActivitySimulatorOptions> = {}): ActivitySimulator {
    const platform = process.platform;
    
    switch (platform) {
      case 'win32':
        return new WindowsActivitySimulator(options);
      case 'darwin':
        return new MacOSActivitySimulator(options);
      case 'linux':
        return new LinuxActivitySimulator(options);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Get platform name
   */
  static getPlatformName(): string {
    const platform = process.platform;
    
    switch (platform) {
      case 'win32':
        return 'Windows';
      case 'darwin':
        return 'macOS';
      case 'linux':
        return 'Linux';
      default:
        return 'Unknown';
    }
  }

  /**
   * Check if platform is supported
   */
  static isPlatformSupported(): boolean {
    const platform = process.platform;
    return ['win32', 'darwin', 'linux'].includes(platform);
  }

  /**
   * Get platform capabilities without creating simulator
   */
  static async getPlatformCapabilities(): Promise<{
    platform: string;
    supported: boolean;
    capabilities: any;
  }> {
    const platform = process.platform;
    const platformName = ActivitySimulatorFactory.getPlatformName();
    
    if (!ActivitySimulatorFactory.isPlatformSupported()) {
      return {
        platform: platformName,
        supported: false,
        capabilities: null
      };
    }

    try {
      const simulator = ActivitySimulatorFactory.create();
      const capabilities = simulator.getCapabilities();
      
      return {
        platform: platformName,
        supported: true,
        capabilities
      };
    } catch (error) {
      return {
        platform: platformName,
        supported: false,
        capabilities: null
      };
    }
  }
}
