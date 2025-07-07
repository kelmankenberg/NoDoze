# Activity Simulation Implementation Guide

## Project Overview
Implement user activity simulation in NoDoze to prevent applications like Microsoft Teams, Slack, and Discord from showing "Away" status while keeping the system awake.

## Implementation Phases

### Phase 1: Foundation & Architecture (Days 1-2)
**Goal**: Set up the core architecture for activity simulation

#### Step 1.1: Create Activity Simulation Interface ✅ PLANNED
- [ ] Create `src/main/activity/ActivitySimulator.ts` interface
- [ ] Define common methods: `start()`, `stop()`, `setInterval()`
- [ ] Create platform-specific implementations

#### Step 1.2: Update State Management ✅ PLANNED  
- [ ] Add activity simulation state to main process
- [ ] Create new sleep prevention modes enum
- [ ] Update IPC handlers for new functionality

#### Step 1.3: Platform Detection & Capabilities ✅ PLANNED
- [ ] Detect platform capabilities for activity simulation
- [ ] Add fallback mechanisms for unsupported platforms
- [ ] Create capability reporting system

**Deliverables**:
- Core architecture files
- Updated state management
- Platform capability detection

---

### Phase 2: Platform-Specific Activity Simulation (Days 3-5)
**Goal**: Implement actual activity simulation for each platform

#### Step 2.1: Windows Implementation ✅ PLANNED
- [ ] Research Windows `SendInput()` API via native Node.js addons
- [ ] Implement mouse movement simulation (1-pixel movements)
- [ ] Implement keyboard simulation (Scroll Lock toggle)
- [ ] Test activity detection in Teams/Slack

**Technical Approach**:
```typescript
// Windows: Use SendInput API or robotjs library
interface WindowsActivitySimulator {
  simulateMouseMovement(): void;
  simulateKeyPress(key: string): void;
}
```

#### Step 2.2: macOS Implementation ✅ PLANNED
- [ ] Research Core Graphics events or `osascript` commands
- [ ] Implement mouse movement via CGEvent
- [ ] Implement keyboard simulation
- [ ] Test with macOS applications

**Technical Approach**:
```bash
# macOS: Use osascript or CGEvent
osascript -e 'tell application "System Events" to key code 107' # Scroll Lock
```

#### Step 2.3: Linux Implementation ✅ PLANNED
- [ ] Research `xdotool` or `xinput` commands
- [ ] Implement X11 event injection
- [ ] Add fallback for Wayland environments
- [ ] Test across different desktop environments

**Technical Approach**:
```bash
# Linux: Use xdotool
xdotool mousemove_relative 1 0
xdotool key Scroll_Lock
```

**Deliverables**:
- Working activity simulation on all platforms
- Tested with popular communication apps
- Fallback mechanisms for edge cases

---

### Phase 3: UI Implementation (Days 6-7)
**Goal**: Create the modern three-way toggle UI component

#### Step 3.1: Create Mode Toggle Component ✅ PLANNED
- [ ] Create `SleepPreventionModeToggle.tsx` component
- [ ] Implement three-way vertical toggle design
- [ ] Add smooth animations between states
- [ ] Create hover and active states

#### Step 3.2: Update Main App UI ✅ PLANNED
- [ ] Integrate mode toggle into `App.tsx`
- [ ] Position between main button and timer section
- [ ] Update status indicators to reflect current mode
- [ ] Add info tooltip explaining each mode

#### Step 3.3: Create CSS Animations ✅ PLANNED
- [ ] Smooth toggle thumb transitions
- [ ] Text color transitions
- [ ] Hover effects and micro-interactions
- [ ] Responsive design considerations

**UI States**:
- **Basic**: System sleep prevention only
- **Full**: System + activity simulation (default)
- **Activity Only**: Activity simulation without sleep prevention

**Deliverables**:
- Modern toggle component
- Updated main interface
- Smooth animations and transitions

---

### Phase 4: Integration & State Management (Day 8)
**Goal**: Connect UI to backend functionality

#### Step 4.1: Update Main Process Logic ✅ PLANNED
- [ ] Modify `preventSleep()` and `allowSleep()` functions
- [ ] Add mode-specific behavior handling
- [ ] Update icon management for new states
- [ ] Implement proper cleanup on mode changes

#### Step 4.2: Update IPC Communication ✅ PLANNED
- [ ] Add IPC handlers for mode changes
- [ ] Update tray menu to show current mode
- [ ] Add quick mode switching in tray
- [ ] Persist mode selection in settings

#### Step 4.3: State Persistence ✅ PLANNED
- [ ] Save selected mode to user preferences
- [ ] Restore mode on app startup
- [ ] Handle mode conflicts (e.g., timer with activity-only)

**Deliverables**:
- Fully integrated mode switching
- Persistent user preferences
- Updated tray menu functionality

---

### Phase 5: Testing & Validation (Days 9-10)
**Goal**: Ensure functionality works across platforms and applications

#### Step 5.1: Platform Testing ✅ PLANNED
- [ ] Test on Windows 10/11 with Teams, Slack, Discord
- [ ] Test on macOS with various communication apps
- [ ] Test on Linux (Ubuntu, Fedora) with different DEs
- [ ] Document platform-specific limitations

#### Step 5.2: Integration Testing ✅ PLANNED
- [ ] Test mode switching during active sessions
- [ ] Test timer functionality with different modes
- [ ] Test system sleep behavior in each mode
- [ ] Verify tray menu synchronization

#### Step 5.3: User Experience Testing ✅ PLANNED
- [ ] Test UI responsiveness and animations
- [ ] Verify tooltip information is helpful
- [ ] Test accessibility (keyboard navigation)
- [ ] Gather feedback on mode terminology

**Test Matrix**:
| Platform | Teams | Slack | Discord | System Sleep | Activity Sim |
|----------|-------|-------|---------|--------------|-------------|
| Windows  | [ ]   | [ ]   | [ ]     | [ ]          | [ ]         |
| macOS    | [ ]   | [ ]   | [ ]     | [ ]          | [ ]         |
| Linux    | [ ]   | [ ]   | [ ]     | [ ]          | [ ]         |

**Deliverables**:
- Comprehensive test results
- Platform compatibility matrix
- Performance benchmarks

---

### Phase 6: Documentation & Polish (Day 11)
**Goal**: Complete documentation and final polish

#### Step 6.1: Update Documentation ✅ PLANNED
- [ ] Update README with new features
- [ ] Create user guide for activity modes
- [ ] Document technical implementation details
- [ ] Update codebase analysis document

#### Step 6.2: Code Cleanup ✅ PLANNED
- [ ] Remove debug logging
- [ ] Clean up commented code
- [ ] Optimize performance
- [ ] Add comprehensive error handling

#### Step 6.3: Release Preparation ✅ PLANNED
- [ ] Update version numbers
- [ ] Test packaged builds on all platforms
- [ ] Create release notes
- [ ] Prepare distribution packages

**Deliverables**:
- Updated documentation
- Clean, production-ready code
- Release packages

---

## Technical Dependencies

### Required Libraries
- **Windows**: `robotjs` or native Node.js addon for SendInput
- **macOS**: Native `osascript` commands (no additional deps)
- **Linux**: `xdotool` package (user-installable)

### Development Tools
- TypeScript for type safety
- React for UI components
- Electron IPC for communication
- CSS animations for smooth transitions

### Testing Tools
- Jest for unit tests
- Manual testing with communication apps
- Cross-platform validation

---

## Risk Assessment

### High Risk
- **Platform compatibility**: Activity simulation may not work on all systems
- **Anti-virus detection**: Some security software may flag activity simulation
- **Application updates**: Teams/Slack updates might change idle detection

### Medium Risk
- **Performance impact**: Continuous activity simulation resource usage
- **User expectations**: Users may expect immediate results in all apps
- **Permission requirements**: Some platforms may need elevated permissions

### Low Risk
- **UI complexity**: Three-way toggle implementation
- **State management**: Mode switching and persistence
- **Documentation**: Explaining feature differences to users

---

## Success Criteria

### Functional Requirements ✅
- [ ] Activity simulation prevents "Away" status in Teams/Slack
- [ ] Three sleep prevention modes work as designed
- [ ] Cross-platform compatibility (Windows, macOS, Linux)
- [ ] Smooth UI transitions and modern design
- [ ] Settings persistence across app restarts

### Performance Requirements ✅
- [ ] Activity simulation uses <1% CPU
- [ ] No noticeable lag or interference with user input
- [ ] Memory usage remains under 50MB
- [ ] Battery impact minimized on laptops

### User Experience Requirements ✅
- [ ] Mode switching is intuitive and immediate
- [ ] Clear visual feedback for current state
- [ ] Helpful tooltips and documentation
- [ ] Consistent behavior across platforms

---

## Progress Tracking

**Current Status**: 📋 Planning Phase
**Next Step**: Begin Phase 1 - Foundation & Architecture
**Estimated Completion**: 11 days from start
**Priority**: High (addresses critical user need)

---

## Notes
- Focus on Teams/Slack as primary test applications
- Consider adding user feedback mechanism for mode effectiveness
- Plan for future features (scheduling, app-specific detection)
- Keep existing functionality completely intact during implementation
