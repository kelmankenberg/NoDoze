import React, { useState, useRef, useEffect } from 'react';

interface MoreMenuProps {
  currentTheme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ currentTheme, onThemeToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Toggle menu open/closed state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle theme toggle and close menu
  const handleThemeToggle = () => {
    onThemeToggle();
    setIsOpen(false);
  };

  // Determine theme-related labels and icons
  const themeToggleText = currentTheme === 'light' 
    ? 'Switch to Dark Mode' 
    : 'Switch to Light Mode';
  
  const themeToggleIcon = currentTheme === 'light' ? '🌙' : '☀️';

  return (
    <div className="more-menu-container">
      <button 
        ref={buttonRef}
        className="title-bar-button more-menu-button" 
        onClick={toggleMenu}
        aria-label="More Options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="2" r="1.5" fill="currentColor" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
          <circle cx="8" cy="14" r="1.5" fill="currentColor" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          ref={menuRef} 
          className="more-menu-dropdown"
          role="menu"
        >
          <button 
            className="more-menu-item" 
            onClick={handleThemeToggle}
            role="menuitem"
          >
            <span className="more-menu-item-text">{themeToggleText}</span>
            <span className="more-menu-item-icon">{themeToggleIcon}</span>
          </button>
          
          {/* Additional menu items can be added here in the future */}
        </div>
      )}
    </div>
  );
};

export default MoreMenu;
