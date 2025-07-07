# Feature Specification: NoDoze

## Overview
NoDoze is designed to prevent the computer from entering sleep mode or starting the screensaver through temporary means, offering users flexible control via manual, timer, and schedule-based modes.

---

## Features

### 1. Prevent Sleep & Screensaver (Core)
- **Description**: Uses OS-level APIs or light simulated activity to prevent sleep/screensaver.
- **Platforms**: Windows, macOS, Linux.
- **UI**: Toggle switch (On/Off) in main window or tray/menu.

---

### 2. Timer Mode
- **Description**: Allows the user to set a countdown (e.g., 30 min, 2 hours) to keep the system awake.
- **UI**: Input field or preset buttons (15 min, 30 min, 1 hr, custom).
- **Behavior**: Automatically stops after timer expires.

---

### 3. Schedule Mode
- **Description**: Lets users set specific time windows when NoDoze is active.
- **UI**: Calendar or weekly schedule grid (e.g., Mon–Fri, 9 AM–5 PM).
- **Behavior**: Automatically activates/deactivates based on schedule.

---

### 4. System Tray / Menu Bar Integration
- **Description**: Small icon in system tray or macOS menu bar.
- **UI**: Right-click/left-click opens quick menu (Start/Stop, Timer, Schedule, Settings).
- **Behavior**: Main window minimized to tray when running.

---

### 5. Custom Activity Simulation (Optional)
- **Description**: Choose between:
    - Mouse jiggle (visible/invisible).
    - Periodic “heartbeat” keystroke (non-intrusive).
    - OS-level wake requests.
- **UI**: Dropdown selection in settings.

---

### 6. Auto-Start on Boot (Optional)
- **Description**: Option to launch NoDoze automatically at system startup.
- **UI**: Toggle checkbox in settings.

---

### 7. Power & Battery Awareness (Optional)
- **Description**: Detects when the system is on battery; warns or optionally disables NoDoze.
- **UI**: Toggle in settings + warning messages.

---

### 8. Logging & Statistics (Optional)
- **Description**: Track and display how long NoDoze has been active.
- **UI**: Statistics page showing daily/weekly summaries.

---

## UI/UX Considerations
- Minimal and non-intrusive.
- Clean, lightweight design.
- Dark/light mode support.
- Accessible controls for timers and schedules.

## Technical Considerations
- Use platform-specific APIs for sleep prevention (e.g., Windows SetThreadExecutionState, macOS IOKit assertions, Linux `caffeinate` equivalents).
- Ensure low resource footprint.
- Avoid requiring elevated permissions.