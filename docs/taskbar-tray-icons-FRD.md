# NoDoze Taskbar and System Tray Icons - Functional Requirements Document

## Overview

This document defines the requirements for the taskbar and system tray icon functionality in the NoDoze application. These icons provide visual feedback about the application's status and offer quick access to essential application features without needing to open the main window.

## Goals and Objectives

1. Provide clear visual indication of the application's sleep prevention status through the taskbar and system tray icons
2. Offer quick access to essential application functions through the system tray context menu
3. Ensure platform-specific compatibility for icons across Windows, macOS, and Linux
4. Implement a robust fallback system for icon loading to prevent application crashes
5. Address known Windows-specific taskbar icon issues with specialized fixes

## Functional Requirements

### 1. System Tray Icon

#### 1.1 Icon States
- Two distinct icon states must be supported:
  - **Inactive State:** Default icon indicating sleep prevention is disabled
  - **Active State:** Alternative icon indicating sleep prevention is enabled
- Icons should be visually distinctive to clearly convey the current state

#### 1.2 Tray Menu Functionality
- Left-clicking the tray icon will toggle the main application window visibility
- Right-clicking the tray icon will display a context menu with the following options:
  - **Open NoDoze:** Shows the main application window
  - **Prevent Sleep:** Checkbox toggle to enable/disable sleep prevention
  - **Sleep Prevention Mode submenu:**
    - Basic (Sleep only)
    - Full (Sleep + Activity)
    - Activity Only
    - Current mode indicator (disabled item showing current selection)
  - **Quick Timer submenu:**
    - Time presets (15 mins, 30 mins, 1 hour, 2 hours, 4 hours)
    - Custom timer option
    - Cancel timer option (only when timer is active)
  - **Settings submenu:**
    - Start with system
    - Minimize to tray
    - Show notifications
  - **Quit:** Properly closes the application

#### 1.3 Tooltip
- The tray icon should display a tooltip when hovered:
  - When inactive: "NoDoze - Sleep Prevention Inactive"
  - When active: "NoDoze - Sleep Prevention Active"

### 2. Taskbar Icon

#### 2.1 Icon States
- The application's taskbar icon should match the system tray icon state:
  - Inactive state when sleep prevention is disabled
  - Active state when sleep prevention is enabled
- On Windows, an additional overlay icon should be shown when active for better visibility

#### 2.2 Windows-Specific Requirements
- Implement specialized fixes to address known Windows taskbar icon issues:
  - Try multiple icon locations to ensure the correct icon is loaded
  - Use proper icon formats (.ico for Windows)
  - Apply overlay icons to refresh the taskbar cache
  - Handle high-DPI displays with appropriately sized icons

### 3. Icon Loading System

#### 3.1 Platform-Specific Icon Formats
- **Windows:** Use .ico format for best compatibility
- **macOS:** Use template images (.svg preferred) for proper Dark Mode support
- **Linux:** Support both .png and .svg formats

#### 3.2 Icon Resolution Requirements
- Windows taskbar icons: Minimum 64x64 pixels
- Windows tray icons: 16x16 pixels
- macOS tray icons: Support for Retina displays
- Linux tray icons: Support both standard and HiDPI environments

#### 3.3 Fallback System
- Implement a robust fallback system if preferred icon formats are not available:
  1. Try platform-specific format in dedicated platform folder
  2. Try platform-specific format in build folder
  3. Try generic PNG format
  4. Try generic SVG format
  5. Use empty icon as last resort (preventing application crashes)

## Technical Implementation

### 1. Icon Manager

#### 1.1 Core Functions
- `createTrayIcon(active: boolean)`: Creates the appropriate tray icon based on active state
- `createAppIcon(active: boolean)`: Creates the appropriate taskbar/dock icon based on active state
- `updateAppIcons(window, tray, active)`: Updates both tray and taskbar/dock icons based on active state

#### 1.2 Icon Path Resolution
- Logic to determine the correct icon path based on:
  - Current platform (Windows, macOS, Linux)
  - Development vs production environment
  - Active state of the application

### 2. Windows-Specific Taskbar Fix

#### 2.1 Techniques
- Multiple techniques to ensure correct Windows taskbar icon:
  1. Apply multiple icon sizes (16x16, 24x24, 32x32, 48x48, 64x64)
  2. Copy icon to app.exe directory for direct access
  3. Use SetAppUserModelId for proper taskbar grouping
  4. Apply and clear overlay icons to refresh icon cache

### 3. Tray Menu Management

#### 3.1 Menu Creation
- `createTray()`: Initial creation of the system tray icon and menu
- `updateTrayMenu()`: Updates the tray menu to reflect current application state

#### 3.2 Menu Item Handling
- Event handlers for each menu item to perform appropriate actions
- Dynamic menu updates based on current application state

## Cross-Platform Considerations

### 1. Windows
- Use .ico format for both taskbar and tray icons
- Apply special taskbar icon fixes
- Support overlay icons for additional status indication

### 2. macOS
- Use template images for proper Dark Mode support
- Support Retina display with high-resolution icons
- Follow macOS human interface guidelines for tray (menu bar) icons

### 3. Linux
- Support multiple desktop environments (GNOME, KDE, etc.)
- Provide both light and dark theme icons
- Support AppIndicator where available

## Error Handling

### 1. Icon Loading Failures
- Implement comprehensive error handling for icon loading failures
- Provide fallback options to prevent application crashes
- Log detailed error information for troubleshooting

### 2. Tray Creation Failures
- Handle scenarios where system tray may not be available
- Provide alternative UI feedback when tray icon cannot be created

## Implementation Priorities

1. Core tray icon functionality with active/inactive states
2. Basic tray menu with essential functions
3. Windows taskbar icon fixes
4. Cross-platform icon compatibility
5. Enhanced tray menu with additional options
6. Fallback systems and error handling

## Testing Requirements

1. Test icon appearance and behavior on all supported platforms
2. Verify correct icon states when toggling sleep prevention
3. Test all tray menu functions
4. Verify Windows taskbar icon updates correctly
5. Test fallback system by intentionally removing primary icon files
6. Verify behavior on high-DPI displays

## Future Enhancements

1. Custom icon themes or icon packs
2. User-configurable tray menu options
3. Animated icons for certain states (e.g., active timer)
4. System theme detection for automatic icon selection (light/dark variants)

## Existing Icon Resources

### Public Folder Icons
The application currently uses the following icon resources located in the `public` folder:

- **icon-active.svg**: Vector icon for active state (used for both tray and taskbar)
- **icon-inactive.svg**: Vector icon for inactive state (used for both tray and taskbar)
- **eye-active.svg**: Alternative eye-shaped icon for active state (used primarily for tray)
- **eye-inactive.svg**: Alternative eye-shaped icon for inactive state (used primarily for tray)
- **icon.png**: Fallback PNG icon used when SVG format is not available
- **icon.svg**: Generic SVG icon used as a final fallback

### Build Folder Icons
Additional icon resources for platform-specific formats are located in the `build` folder:

- **build/icon.ico**: Main application icon for Windows
- **build/icon-active.ico**: Active state icon in Windows ICO format
- **build/icon-inactive.ico**: Inactive state icon in Windows ICO format
- **build/icon-active.svg**: SVG version of the active state icon
- **build/icon-inactive.svg**: SVG version of the inactive state icon
- **build/icon.png**: PNG version of the main application icon
- **build/icons/**: Contains platform-specific icon folders:
  - **build/icons/win/**: Directory containing Windows-specific icons in various sizes
  - **build/icons/mac/**: Directory containing macOS-specific icons
  - **build/icons/linux/**: Directory containing Linux-specific icons
  - **build/icons/icon.svg**: Source SVG icon for generating platform-specific versions

These existing resources are used by the icon management system based on platform, environment (development or production), and application state. The system follows a fallback approach to ensure icons are always displayed properly.

### Current Icon Usage

The application currently implements icon management through the following components:

1. **icon-manager.ts**:
   - `createTrayIcon(active)`: Creates the appropriate system tray icon based on active state
   - `createAppIcon(active)`: Creates the appropriate taskbar/dock icon based on active state
   - `updateAppIcons(window, tray, active)`: Updates both tray and taskbar icons when state changes

2. **Icon Loading Strategy**:
   - Platform detection determines the appropriate icon format to use
   - Environment detection (development vs. production) determines icon paths
   - Multiple fallback paths are attempted if the primary icon isn't found
   - For Windows, ICO files are preferred; for macOS/Linux, SVG files are preferred

3. **Windows Taskbar Fix**:
   - `windows-taskbar-icon-fix.ts` implements specialized techniques to address Windows-specific icon issues
   - Multiple icon paths and sizes are attempted to ensure proper display in the Windows taskbar
   - Special techniques like overlay icons and clearing icon caches are used

4. **Icon State Management**:
   - Icons are updated based on the sleep prevention status
   - When sleep prevention is active, "active" icons are used
   - When sleep prevention is disabled, "inactive" icons are used
   - The system automatically updates both tray and taskbar icons when state changes

## Implementation Checklist

- [ ] 1. Review and document existing icon resources in the project
- [ ] 2. Implement consistent icon loading system for all platforms
- [ ] 3. Refine Windows taskbar icon fix functionality
- [ ] 4. Enhance tray menu organization and functionality
- [ ] 5. Add proper error handling and fallback mechanisms
- [ ] 6. Test icon behavior across all supported platforms
- [ ] 7. Optimize icon resolution for different display densities
- [ ] 8. Connect icon state to application status events
- [ ] 9. Implement theme-aware icons (if applicable)
- [ ] 10. Performance optimization for icon loading and updates
