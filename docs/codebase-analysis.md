# NoDoze Codebase Analysis

## App Purpose and Features

### Core Purpose
NoDoze is a lightweight, cross-platform desktop application built with Electron, React, and TypeScript that prevents computers from going to sleep or starting the screensaver. It provides temporary sleep prevention without permanently changing system power settings.

### Current Features Implemented

#### ✅ Core Features (Implemented)
1. **Sleep Prevention**: Uses platform-specific APIs to prevent system sleep
   - Windows: Uses Electron's `powerSaveBlocker` API
   - macOS: Uses `caffeinate` command
   - Linux: Uses D-Bus inhibit commands and xdg-screensaver
   
2. **System Tray Integration**: Fully functional system tray with context menu
   - Right-click menu with toggle, quick timers, and settings
   - Dynamic icon switching based on active/inactive state
   - Click to show/hide main window
   
3. **Timer Mode**: Countdown timer functionality
   - User can set custom duration in minutes
   - Automatic disable when timer expires
   - Real-time countdown display with progress bar
   - Quick timer presets (15 min, 30 min, 1 hr, 2 hr)
   
4. **Dynamic Icon System**: State-aware icon switching
   - Different icons for active/inactive states
   - Platform-specific icon handling (ICO for Windows, SVG for others)
   - Taskbar and tray icon synchronization
   
5. **Custom Window Controls**: Frameless window with custom title bar
   - Minimize, corner positioning, and close buttons
   - Drag-to-move functionality
   
6. **Auto-Start Configuration**: Login item settings
   - Toggle to start with system boot
   - Start minimized to tray option

#### ⚠️ Partially Implemented Features
1. **Platform-Specific Implementations**: 
   - Windows: Fully implemented with `powerSaveBlocker`
   - macOS: Basic implementation with `caffeinate`
   - Linux: Complex implementation with multiple fallback methods
   
2. **Icon Management**: Multiple overlapping icon management systems
   - Several icon utility modules with redundant functionality
   - Complex path resolution for different environments

#### ❌ Missing Features (From PRD)
1. **🚨 CRITICAL: User Activity Simulation**: Mouse jiggle, keystroke simulation to prevent "Away" status
2. **Schedule Mode**: Time-based automatic activation
3. **Application Detection**: Auto-enable when specific apps are running
4. **Idle Notifications**: Warnings before sleep
5. **Logging & Statistics**: Usage tracking and display
6. **Profiles/Presets**: Saved configuration sets
7. **Power & Battery Awareness**: Battery-specific behavior
8. **Metrics and Feedback**: Usage reporting and feedback mechanism

## Code Issues and Problems

### 1. **Icon Management Complexity** (High Priority)
**Problem**: Multiple overlapping icon management systems creating confusion and potential conflicts.

**Files Affected**:
- `src/main/icon-manager.ts`
- `src/main/icon-utils.ts`
- `src/main/icon-helper.ts`
- `src/main/fix-tray-menu.ts`
- `src/main/force-taskbar-icon-update.ts`
- `src/main/windows-taskbar-icon-fix.ts`

**Issues**:
- Six different icon management modules with overlapping functionality
- Complex path resolution logic repeated across modules
- Different approaches to Windows taskbar icon handling
- Multiple fallback mechanisms that may conflict

**Impact**: Maintenance nightmare, potential runtime conflicts, difficult debugging

### 2. **Platform Implementation Inconsistencies** (Medium Priority)
**Problem**: Different levels of implementation completeness across platforms.

**Files Affected**:
- `src/main/platforms/windows.ts` (157 lines)
- `src/main/platforms/macos.ts` (86 lines)
- `src/main/platforms/linux.ts` (133 lines)

**Issues**:
- Windows uses modern `powerSaveBlocker` API
- macOS uses command-line `caffeinate` (less reliable)
- Linux uses complex D-Bus commands with multiple fallbacks
- No consistent error handling across platforms
- Different feature sets available on each platform

**Impact**: Inconsistent user experience, platform-specific bugs

### 3. **Legacy File Management** (Medium Priority)
**Problem**: Multiple backup and experimental files cluttering the codebase.

**Files Affected**:
- `src/main/index.ts.backup` (1163 lines)
- `src/main/index.ts.fixed` (626 lines)
- `src/main/index.ts.new` (637 lines)
- Various icon fix scripts in root directory

**Issues**:
- Backup files contain different implementations
- Unclear which implementation is current
- Development artifacts left in codebase
- Potential confusion about which files are active

**Impact**: Developer confusion, larger repository size, deployment issues

### 4. **Missing Error Handling** (Medium Priority)
**Problem**: Insufficient error handling and user feedback for failure cases.

**Files Affected**:
- All platform implementation files
- Main process IPC handlers
- Icon management modules

**Issues**:
- Platform-specific sleep prevention can fail silently
- No user notification for failures
- Limited logging for debugging
- No fallback UI feedback when system tray fails

**Impact**: Poor user experience, difficult troubleshooting

### 5. **Test Coverage Gaps** (Low Priority)
**Problem**: Limited test coverage for core functionality.

**Files Affected**:
- `src/__tests__/main/index.test.ts` (basic mocking only)
- `src/__tests__/main/platforms/windows.test.ts`
- Missing tests for icon management, timer functionality

**Issues**:
- No integration tests for sleep prevention
- No tests for cross-platform compatibility
- Limited mocking of Electron APIs
- No end-to-end testing

**Impact**: Potential regressions, difficult refactoring

### 6. **Performance and Resource Usage** (Low Priority)
**Problem**: Potential resource inefficiencies.

**Issues**:
- Multiple timer intervals running simultaneously
- Complex icon path resolution on every update
- Frequent file system checks for icon existence
- Memory leaks possible with multiple icon management systems

**Impact**: Higher resource usage than necessary

## Recommendations

### Immediate Actions (Critical)
1. **Consolidate Icon Management**: Merge all icon-related modules into a single, well-designed system
2. **Clean Up Legacy Files**: Remove backup and experimental files from main codebase
3. **Standardize Platform Implementations**: Ensure consistent API and error handling

### Short-term Improvements (High Priority)
1. **Implement Missing Core Features**: Schedule mode, application detection
2. **Add Comprehensive Error Handling**: User-friendly error messages and recovery
3. **Improve Test Coverage**: Add integration and cross-platform tests

### Long-term Enhancements (Medium Priority)
1. **Add Advanced Features**: Logging, statistics, custom activity simulation
2. **Implement User Preferences**: Profiles, presets, advanced settings
3. **Add Battery Awareness**: Power-specific behavior and warnings

## Current State Assessment

### Strengths
- ✅ Core sleep prevention functionality works across platforms
- ✅ Modern Electron + React + TypeScript architecture
- ✅ Good UI/UX design with custom controls
- ✅ System tray integration with dynamic icons
- ✅ Timer functionality with visual feedback

### Weaknesses
- ❌ Overcomplicated icon management system
- ❌ Missing key features from PRD (scheduling, app detection)
- ❌ Inconsistent platform implementations
- ❌ Poor error handling and user feedback
- ❌ Code organization issues with multiple redundant modules

### Overall Assessment
The NoDoze application successfully implements its core purpose of preventing system sleep with a modern, user-friendly interface. However, the codebase suffers from architectural complexity issues, particularly around icon management, and is missing several features outlined in the PRD. The application is functional but needs significant refactoring and feature completion to meet its full potential.

**Recommendation**: Focus on consolidating the icon management system and implementing the missing scheduled sleep prevention features before adding advanced functionality.

**Examples**:
- Icon path resolution logic repeated in 6+ files
- Similar tray menu creation logic in multiple places
- Platform detection logic duplicated
- Error handling patterns inconsistent

**Recommendation**: Extract common utilities and establish consistent patterns.

### 4. **Test Coverage Gaps** ⚠️ MEDIUM PRIORITY
**Problem**: Incomplete test coverage for critical functionality.

**Missing Tests**:
- Platform-specific sleep prevention logic
- Icon management system
- Timer functionality
- Tray menu interactions
- Error scenarios

**Existing Tests**:
- Basic main process tests
- Some platform tests
- Basic renderer component tests

### 5. **Development vs Production Path Issues** ⚠️ LOW PRIORITY
**Problem**: Complex path resolution logic for development vs packaged builds.

**Issues**:
- Multiple fallback paths for icons
- Different logic for `app.isPackaged` vs development
- Path resolution complexity could be simplified

### 6. **Memory Management** ⚠️ LOW PRIORITY
**Problem**: Potential memory leaks in icon management.

**Issues**:
- Multiple icon objects created without cleanup
- Tray icon recreation without proper disposal
- Timer management could be improved

## Functional Issues

### 1. **Icon State Synchronization** ⚠️ HIGH PRIORITY
**Problem**: Tray and taskbar icons may not consistently reflect the current sleep prevention state.

**Root Causes**:
- Multiple icon update functions that may conflict
- Windows icon caching issues
- Async icon updates without proper synchronization

**Impact**: User confusion about current state

### 2. **Platform-Specific Reliability** ⚠️ MEDIUM PRIORITY
**Problem**: Platform implementations may fail silently or have edge cases.

**Windows Issues**:
- `powerSaveBlocker` may not work on all Windows versions
- Icon caching in Windows taskbar

**macOS Issues**:
- `caffeinate` command may not be available on all systems
- Process management for background caffeinate

**Linux Issues**:
- D-Bus may not be available on all distributions
- Multiple desktop environments have different requirements

### 3. **Error Handling** ⚠️ MEDIUM PRIORITY
**Problem**: Inconsistent error handling across the application.

**Issues**:
- Some platform failures fail silently
- Icon loading errors not properly handled
- Timer errors not communicated to user

## Security Issues

### 1. **Shell Command Execution** ⚠️ MEDIUM PRIORITY
**Problem**: macOS and Linux implementations use shell command execution.

**Files Affected**:
- `src/main/platforms/macos.ts`
- `src/main/platforms/linux.ts`

**Risk**: Potential command injection if user input is ever passed to these commands (currently not a risk as no user input is passed).

**Recommendation**: Continue using shell commands but ensure input validation if this changes.

## Performance Issues

### 1. **Icon File I/O** ⚠️ LOW PRIORITY
**Problem**: Frequent file system operations for icon updates.

**Issues**:
- Multiple `fs.existsSync()` calls
- File reads for icon creation
- Could be optimized with caching

### 2. **Platform Detection** ⚠️ LOW PRIORITY
**Problem**: Platform detection logic called frequently.

**Recommendation**: Cache platform implementation at startup.

## Architectural Issues

### 1. **Separation of Concerns** ⚠️ MEDIUM PRIORITY
**Problem**: Main process file (`src/main/index.ts`) handles too many responsibilities.

**Issues**:
- Window management
- Tray management
- Icon management
- Platform-specific logic
- IPC handling

**Recommendation**: Split into focused modules.

### 2. **Configuration Management** ⚠️ LOW PRIORITY
**Problem**: No centralized configuration system.

**Issues**:
- Hard-coded paths and settings
- No user preferences persistence
- No settings validation

## Recommendations

### Immediate Actions (High Priority)
1. **Simplify Icon Management**
   - Consolidate all icon management into a single module
   - Remove duplicate path resolution logic
   - Implement simple, reliable icon switching

2. **Fix Icon State Synchronization**
   - Ensure tray and taskbar icons update atomically
   - Add state validation and recovery

3. **Improve Error Handling**
   - Add consistent error reporting
   - Implement fallback behaviors
   - Add user-visible error messages

### Short-term Improvements (Medium Priority)
1. **Standardize Platform Interfaces**
   - Create consistent platform API
   - Improve error handling across platforms
   - Add platform capability detection

2. **Reduce Code Duplication**
   - Extract common utilities
   - Standardize error handling patterns
   - Create reusable components

3. **Improve Test Coverage**
   - Add integration tests
   - Test platform-specific functionality
   - Test error scenarios

### Long-term Enhancements (Low Priority)
1. **Implement Missing Features**
   - Schedule mode
   - Application detection
   - Logging and statistics

2. **Performance Optimizations**
   - Cache icon resources
   - Optimize file I/O
   - Improve memory management

3. **Architecture Improvements**
   - Modularize main process
   - Add configuration system
   - Improve state management

## Conclusion

NoDoze successfully implements its core functionality but suffers from over-engineering in the icon management system and inconsistent patterns across the codebase. The application works but has complexity that could lead to maintenance issues and reliability problems.

The most critical issues are related to icon state synchronization and the overly complex icon management system. Addressing these issues would significantly improve the application's reliability and maintainability.

The missing features from the PRD represent opportunities for future development but are not blocking the core functionality of the application.

## Risk Assessment

- **High Risk**: Icon state synchronization issues could confuse users
- **Medium Risk**: Platform-specific failures could prevent core functionality
- **Low Risk**: Code complexity makes maintenance difficult but doesn't affect functionality

## Estimated Effort to Fix Critical Issues

- **Icon Management Simplification**: 2-3 days
- **State Synchronization**: 1-2 days  
- **Error Handling Improvements**: 1-2 days
- **Platform Interface Standardization**: 2-3 days

**Total estimated effort for critical fixes: 6-10 days**

## Critical Gap: User Activity Simulation Missing

### **MAJOR ISSUE: Apps Still Show "Away" Status** (Critical Priority)

**Problem**: The current implementation only prevents **system sleep** but does NOT prevent applications from detecting user inactivity.

**Real-World Impact**:
- Microsoft Teams still shows user as "Away" after idle time
- Slack, Discord, and other communication apps detect inactivity
- Screen savers may still activate (separate from system sleep)
- Applications that track user activity still see idle time

**Current Implementation Limitations**:

#### Windows (`powerSaveBlocker`)
- ✅ Prevents system from sleeping
- ❌ Does NOT simulate user activity
- ❌ Apps still detect keyboard/mouse inactivity

#### macOS (`caffeinate`)
- ✅ Prevents system sleep with `-i` flag
- ✅ Prevents display sleep with `-d` flag  
- ❌ Does NOT simulate user input activity
- ❌ Apps still detect user as idle

#### Linux (D-Bus inhibit)
- ✅ Prevents system sleep via systemd-logind
- ❌ Does NOT simulate user activity
- ❌ Apps still detect idle state

### **Solution Required: Activity Simulation**

To truly keep applications from showing "Away" status, NoDoze needs to implement **user activity simulation**:

1. **Mouse Movement Simulation**
   - Tiny, imperceptible mouse movements every few minutes
   - Prevents applications from detecting mouse inactivity

2. **Keyboard Activity Simulation**
   - Send non-disruptive keystrokes (e.g., Scroll Lock toggle)
   - Prevents applications from detecting keyboard inactivity

3. **Platform-Specific Implementation**:
   - **Windows**: Use `SendInput()` API or similar
   - **macOS**: Use Core Graphics events or `osascript`
   - **Linux**: Use `xdotool` or similar X11 event injection

### **Current PRD Reference**
The PRD does mention this under "Custom Activity Simulation":
> - Choose method:
>     - OS-level wake locks.
>     - Mouse jiggle (invisible or visible).
>     - Fake keystroke/heartbeat.

**Status**: ❌ Not implemented - This is why Teams still shows "Away"

### **Recommended Implementation**

Add a new option in the UI:
- [ ] Prevent system sleep only (current behavior)
- [ ] Prevent system sleep + simulate user activity (new feature)

**Technical Approach**:
```typescript
// New interface for activity simulation
interface ActivitySimulator {
  startSimulation(): Promise<boolean>;
  stopSimulation(): Promise<boolean>;
  setInterval(minutes: number): void;
}
```

This explains why Microsoft Teams and other applications still detect the user as away - NoDoze is only preventing the system from sleeping, not simulating user activity that applications monitor.
