/**
 * Unit tests for the improved icon manager
 */

import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { app, nativeImage, BrowserWindow, Tray } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import iconManager, { IconManager } from '../main/icon-manager-improved';
import { fixWindowsTaskbarIcon } from '../main/windows-taskbar-icon-fix';

// Mock dependencies
jest.mock('electron', () => ({
  app: {
    getAppPath: jest.fn().mockReturnValue('/mock/app/path'),
    getPath: jest.fn().mockReturnValue('/mock/exe/path'),
    isPackaged: false
  },
  nativeImage: {
    createFromPath: jest.fn().mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      resize: jest.fn().mockImplementation((size) => ({
        width: size.width,
        height: size.height,
        isEmpty: () => false,
        setTemplateImage: jest.fn()
      })),
      setTemplateImage: jest.fn()
    }),
    createEmpty: jest.fn().mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true)
    })
  }
}));

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true)
}));

jest.mock('../main/windows-taskbar-icon-fix', () => ({
  fixWindowsTaskbarIcon: jest.fn()
}));

describe('IconManager', () => {
  let mockTray: any;
  let mockWindow: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock tray and window objects
    mockTray = {
      setImage: jest.fn(),
      setToolTip: jest.fn()
    };
    
    mockWindow = {
      setIcon: jest.fn(),
      setOverlayIcon: jest.fn()
    };
    
    // Set platform for testing
    Object.defineProperty(process, 'platform', {
      value: 'win32'
    });
  });
  
  describe('loadIcon', () => {
    it('should load the correct icon for the active state', () => {
      const icon = iconManager.loadIcon('active', 'tray');
      expect(nativeImage.createFromPath).toHaveBeenCalled();
      expect(icon).toBeDefined();
    });
    
    it('should load the correct icon for the inactive state', () => {
      const icon = iconManager.loadIcon('inactive', 'tray');
      expect(nativeImage.createFromPath).toHaveBeenCalled();
      expect(icon).toBeDefined();
    });
    
    it('should handle errors and load fallback icon', () => {
      // Mock fs.existsSync to fail first then succeed for fallback
      (fs.existsSync as jest.Mock).mockImplementationOnce(() => false);
      
      const icon = iconManager.loadIcon('active', 'tray');
      expect(icon).toBeDefined();
    });
  });
  
  describe('updateAppIcons', () => {
    it('should update tray icon when tray is available', () => {
      iconManager.updateAppIcons(null, mockTray as any, true);
      expect(mockTray.setImage).toHaveBeenCalled();
      expect(mockTray.setToolTip).toHaveBeenCalledWith('NoDoze - Sleep Prevention Active');
    });
    
    it('should update window icon when window is available', () => {
      iconManager.updateAppIcons(mockWindow as any, null, true);
      expect(mockWindow.setIcon).toHaveBeenCalled();
    });
    
    it('should set overlay icon on Windows when active', () => {
      iconManager.updateAppIcons(mockWindow as any, null, true);
      expect(mockWindow.setOverlayIcon).toHaveBeenCalled();
    });
    
    it('should clear overlay icon on Windows when inactive', () => {
      iconManager.updateAppIcons(mockWindow as any, null, false);
      expect(mockWindow.setOverlayIcon).toHaveBeenCalledWith(null, '');
    });
    
    it('should call fixWindowsTaskbarIcon on Windows', () => {
      iconManager.updateAppIcons(mockWindow as any, null, true);
      expect(fixWindowsTaskbarIcon).toHaveBeenCalledWith(mockWindow);
    });
  });
  
  describe('Fallback system', () => {
    it('should try fallback paths when primary icon is not found', () => {
      // Mock fs.existsSync to fail for all primary paths
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(false) // First attempt fails
        .mockReturnValueOnce(false) // Second attempt fails 
        .mockReturnValueOnce(true);  // Fallback succeeds
      
      const icon = iconManager.loadIcon('active', 'tray');
      expect(icon).toBeDefined();
      expect(nativeImage.createFromPath).toHaveBeenCalled();
    });
    
    it('should create empty icon when all fallbacks fail', () => {
      // Mock fs.existsSync to always fail
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const icon = iconManager.loadIcon('active', 'tray');
      expect(icon).toBeDefined();
      expect(nativeImage.createEmpty).toHaveBeenCalled();
    });
  });
  
  describe('Legacy API', () => {
    it('createTrayIcon should call getTrayIcon', () => {
      const spy = jest.spyOn(iconManager, 'getTrayIcon');
      const icon = require('../main/icon-manager-improved').createTrayIcon(true);
      
      expect(spy).toHaveBeenCalledWith(true);
      expect(icon).toBeDefined();
    });
    
    it('createAppIcon should call getAppIcon', () => {
      const spy = jest.spyOn(iconManager, 'getAppIcon');
      const icon = require('../main/icon-manager-improved').createAppIcon(true);
      
      expect(spy).toHaveBeenCalledWith(true);
      expect(icon).toBeDefined();
    });
    
    it('updateAppIcons should call IconManager.updateAppIcons', () => {
      const spy = jest.spyOn(iconManager, 'updateAppIcons');
      require('../main/icon-manager-improved').updateAppIcons(
        mockWindow as any,
        mockTray as any,
        true
      );
      
      expect(spy).toHaveBeenCalledWith(mockWindow, mockTray, true);
    });
  });
});
