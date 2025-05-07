# Product Requirements Document (PRD)

## Product Name

**NoDoze**

## Purpose

*NoDoze* is a lightweight, cross-platform desktop application (Electron/React/TypeScript) designed to prevent the computer from going to sleep or starting the screensaver. It does this temporarily by interrupting these features (without permanently changing system settings) until the user stops or the app releases control. It offers manual, timer-based, and schedule-based modes for flexible control.

* * *

## Core Features

### 1\. Prevent Sleep & Screensaver

- Keeps the system awake using OS APIs or simulated activity.
- Avoids changing permanent power or display settings.
- Supports Windows, macOS, and Linux platforms.

### 2\. Timer Mode

- User sets a countdown timer (e.g., 30 min, 2 hours).
- When the timer expires, NoDoze stops preventing sleep automatically.

### 3\. Schedule Mode (Phase 2)

- User defines time windows (e.g., weekdays 9 AM–5 PM) during which NoDoze is active.
- Supports recurring schedules and one-off events.

### 4\. System Tray / Menu Bar Integration

- Runs quietly in the system tray or macOS menu bar.
- Right-click or click opens quick-access menu.

### 5\. Auto-Start on Boot

- Option to start NoDoze automatically when the system boots.

### 6\. Application Detection

- Automatically enable stay-awake when specific applications are running (e.g., Zoom, VLC, large file transfers). This should be presented to the user by allowing them to scan the computer for installed or portable applications and select desired applications within a list.

### 7\. Idle Notifications

- Notify the user if the system is about to sleep and allow immediate extension or override.

### 8\. Logging & Statistics

- Keep logs of active periods.
- Optionally display stats on how long NoDoze kept the system awake.

### 9\. Minimalist interface
- Use a minimalist level of UI complexity

### 10\. Metrics and feedback
- anonymous usage reporting (opt-in) to understand feature popularity
- feedback mechanism to help with iterative improvements

* * *

## Additional Features (Optional / To Consider)

### Custom Activity Simulation

- Choose method:
    - OS-level wake locks.
    - Mouse jiggle (invisible or visible).
    - Fake keystroke/heartbeat.

### Profiles / Presets

- Save frequently used settings (e.g., “Presentation Mode,” “Long Download,” “Workday”).

### Power & Battery Awareness

- Detect when on battery and warn the user.
- Optionally auto-disable when running on battery.


* * *

## Non-Functional Requirements

- **Cross-Platform Compatibility**
    
    - Windows 10+, macOS 12+, major Linux distros.
- **Lightweight Footprint**
    
    - Minimal CPU and memory usage.
    - Low background resource consumption.
- **Security**
    
    - No need for admin/root privileges.
    - No modification of permanent system or power settings.
- **Accessibility**
    
    - Simple, intuitive UI.
    - Dark and light mode support.
- **Localization (Future-Proofing)**
    
    - Structure UI for multi-language support.


* * *

## Success Metrics

- Successfully prevents system sleep/screensaver across supported platforms.
- Timer and schedule features work reliably.
- App uses minimal system resources (<1% CPU when idle).
- Positive user feedback on simplicity and effectiveness.