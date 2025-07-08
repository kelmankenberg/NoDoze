# NoDoze More Menu - Functional Requirements Document

## Overview

This document defines the requirements for implementing a "More" menu in the NoDoze application. The More menu will be positioned in the title bar near the window control buttons and will provide access to additional features and settings, including a theme toggle option.

## Goals and Objectives

1. Add a More menu to the title bar UI
2. Include a theme toggle feature in the menu
3. Implement Light and Dark mode theme support
4. Ensure all UI elements respect the selected theme

## Functional Requirements

### 1. More Menu UI

#### 1.1 Positioning and Appearance
- The More menu button will be positioned in the title bar, to the left of the window control buttons (minimize, corner, close)
- The button will use a standard "three dots" (ellipsis) icon
- The menu will have a consistent style with the rest of the application
- The menu will appear as a dropdown when clicked

#### 1.2 Menu Behavior
- The menu will open when the user clicks on the More button
- The menu will close when:
  - The user clicks outside the menu
  - The user selects an item from the menu
  - The user clicks the More button again
- The menu will maintain its state (open/closed) when the window is resized

### 2. Theme Toggle Feature

#### 2.1 Theme Support
- The application will support two themes:
  - Light Mode: Default theme with light backgrounds and dark text
  - Dark Mode: Alternative theme with dark backgrounds and light text
- Theme preference will be persisted across application restarts using the SettingsManager

#### 2.2 Theme Toggle UI
- The theme toggle will be an item within the More menu
- The toggle will display the current theme with appropriate icon:
  - Light Mode: Sun icon (☀️)
  - Dark Mode: Moon icon (🌙)
- The toggle will have a label indicating the action (e.g., "Switch to Dark Mode" or "Switch to Light Mode")

#### 2.3 Theme Switching
- Clicking the theme toggle will immediately switch between Light and Dark modes
- The theme change will apply to all UI elements without requiring application restart
- Visual feedback will be provided to indicate the theme change
- The menu will close after the theme is changed

### 3. Theme Implementation

#### 3.1 CSS Variables
- Theme colors will be implemented using CSS variables for consistent application
- Variables will include at least:
  - Primary background color
  - Secondary background color
  - Primary text color
  - Secondary text color
  - Accent color
  - Border color
  - Button colors (default, hover, active)

#### 3.2 Theme Application
- All UI components will use the theme variables rather than hardcoded colors
- Transitions between themes will be smooth with a short animation (0.3s)
- Special consideration will be given to ensure readability in both themes

#### 3.3 Components to Theme
- Title bar
- App header
- Main container
- Buttons (activate button, toggle buttons)
- Sleep prevention mode toggle
- Timer section
- About dialog
- Progress bars
- Status indicators

## Technical Implementation

### 1. Component Structure

#### 1.1 React Components
- Create a `MoreMenu` component that will be added to the TitleBar component
- Add a ThemeContext to manage and provide theme information throughout the app
- Update existing components to consume the ThemeContext

#### 1.2 Settings Integration
- Extend the `UserSettings` interface in SettingsManager.ts to include theme preference
- Add theme related methods to SettingsManager:
  - `getTheme(): 'light' | 'dark'`
  - `setTheme(theme: 'light' | 'dark'): void`

#### 1.3 IPC Communication
- Add IPC handlers for theme-related actions:
  - `get-theme-preference` - Retrieve current theme from settings
  - `set-theme-preference` - Update theme in settings

### 2. Theme Implementation

#### 2.1 CSS Structure
- Create a new `theme.css` file with CSS variables for both themes
- Use CSS classes to apply theme variables (`.theme-light`, `.theme-dark`)
- Update existing CSS files to use theme variables instead of hardcoded colors

#### 2.2 Theme Switching Logic
- Apply the theme class to the root HTML element
- Implement smooth transitions between themes
- Ensure all components use themed CSS variables

## UI Mockups

### Title Bar with More Menu Button
```
+----------------------------------------+
| NoDoze                        ⋮ _ □ X |
+----------------------------------------+
```

### Open More Menu
```
+----------------------------------------+
| NoDoze                        ⋮ _ □ X |
+----------------------------------------+
|                              +--------+
|                              | Switch |
|                              | to Dark|
|                              | Mode ☀️|
|                              +--------+
```

### Dark Mode Theme Applied
```
+----------------------------------------+
| NoDoze                        ⋮ _ □ X | <- Dark title bar
+----------------------------------------+
| [ACTIVATE]                            | <- Dark background
|                                       | <- Light text
| [Sleep Prevention Mode Toggle]        | <- Themed components
|                                       |
| [Timer Section]                       |
|                                       |
+----------------------------------------+
```

## Acceptance Criteria

1. More menu button is visible in the title bar
2. Menu opens and closes correctly
3. Theme toggle option is present in the menu
4. Switching between Light and Dark themes works correctly
5. Theme preference is saved and restored on application restart
6. All UI elements are properly styled in both themes
7. Transitions between themes are smooth
8. Theme respects system accessibility settings

## Implementation Timeline

- [x] 1. Add theme variables to CSS - 1 day
- [x] 2. Create MoreMenu component and integrate with TitleBar - 1 day
- [x] 3. Implement ThemeContext and theme switching logic - 1 day
- [x] 4. Update SettingsManager for theme persistence - 0.5 day
- [x] 5. Test theme support across all components - 1 day
- [x] 6. Final adjustments and bug fixes - 0.5 day

**Total Estimated Time:** 5 days
