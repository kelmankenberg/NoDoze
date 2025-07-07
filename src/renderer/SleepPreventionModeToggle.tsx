/**
 * Sleep Prevention Mode Toggle Component
 * A modern three-way horizontal toggle for selecting sleep prevention modes
 */

import React, { useState, useEffect } from 'react';
import './SleepPreventionModeToggle.css';

export enum SleepPreventionMode {
  BASIC = 'basic',
  FULL = 'full',
  ACTIVITY_ONLY = 'activity-only'
}

export interface SleepPreventionModeToggleProps {
  currentMode: SleepPreventionMode;
  onModeChange: (mode: SleepPreventionMode) => void;
  disabled?: boolean;
  className?: string;
}

interface ModeConfig {
  id: SleepPreventionMode;
  label: string;
  description: string;
  icon: string;
}

const modes: ModeConfig[] = [
  {
    id: SleepPreventionMode.BASIC,
    label: 'Basic',
    description: 'Prevents system sleep only',
    icon: '🛡️'
  },
  {
    id: SleepPreventionMode.FULL,
    label: 'Full',
    description: 'Prevents sleep + simulates activity',
    icon: '🚀'
  },
  {
    id: SleepPreventionMode.ACTIVITY_ONLY,
    label: 'Activity',
    description: 'Simulates activity only',
    icon: '⚡'
  }
];

export const SleepPreventionModeToggle: React.FC<SleepPreventionModeToggleProps> = ({
  currentMode,
  onModeChange,
  disabled = false,
  className = ''
}) => {
  const [hoveredMode, setHoveredMode] = useState<SleepPreventionMode | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleModeClick = (mode: SleepPreventionMode) => {
    if (disabled || mode === currentMode) return;
    
    setIsTransitioning(true);
    onModeChange(mode);
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const getCurrentModeIndex = () => {
    const index = modes.findIndex(mode => mode.id === currentMode);
    console.log('getCurrentModeIndex:', { currentMode, index, modes: modes.map(m => m.id) });
    return index;
  };

  const getThumbPosition = () => {
    const index = getCurrentModeIndex();
    const trackWidth = 240; // px, as set in CSS
    const thumbWidth = 76;  // px, as set in CSS
    const step = (trackWidth - thumbWidth) / 2; // 2 steps for 3 options
    const positionPixels = index * step;
    return `${positionPixels}px`;
  };

  return (
    <div className={`sleep-mode-toggle ${className} ${disabled ? 'disabled' : ''}`}>
      <div className="toggle-header">
        <h3 className="toggle-title">Sleep Prevention Mode</h3>
        <p className="toggle-subtitle">
          {modes.find(m => m.id === currentMode)?.description}
        </p>
      </div>
      
      <div className="toggle-container">
        {/* Background track */}
        <div 
          className="toggle-track"
        >
          {/* Animated thumb */}
          <div 
            className={`toggle-thumb ${isTransitioning ? 'transitioning' : ''}`}
            style={{ 
              transform: `translateX(${getThumbPosition()})`,
              transition: isTransitioning ? 'transform 0.3s ease-out' : 'transform 0.2s ease-out'
            }}
          />
          
          {/* Mode options */}
          <div className="toggle-options">
            {modes.map((mode, index) => (
              <button
                key={mode.id}
                className={`toggle-option ${currentMode === mode.id ? 'active' : ''} ${
                  hoveredMode === mode.id ? 'hovered' : ''
                }`}
                onClick={() => handleModeClick(mode.id)}
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode(null)}
                disabled={disabled}
                title={mode.description}
                aria-label={`Select ${mode.label} mode: ${mode.description}`}
              >
                <div className="option-icon">{mode.icon}</div>
                <div className="option-label">{mode.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepPreventionModeToggle;
