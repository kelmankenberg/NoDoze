import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ipcRenderer } from 'electron';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

// Hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

// Provider component to wrap around the app
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'light' 
}) => {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  console.log('ThemeProvider initialized with initialTheme:', initialTheme);

  // Load saved theme from settings on mount
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        console.log('ThemeContext: Loading saved theme from settings...');
        const savedTheme = await ipcRenderer.invoke('get-theme-preference');
        console.log('ThemeContext: Received saved theme:', savedTheme);
        
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          console.log(`ThemeContext: Setting theme to saved value: ${savedTheme}`);
          setThemeState(savedTheme);
        } else {
          console.log(`ThemeContext: Using default theme: ${initialTheme} (saved theme was: ${savedTheme})`);
        }
      } catch (error) {
        console.error('ThemeContext: Failed to load theme preference:', error);
      }
    };
    
    loadSavedTheme();
  }, [initialTheme]);

  // Apply theme class to HTML element when theme changes
  useEffect(() => {
    console.log(`ThemeContext: Applying theme class: theme-${theme}`);
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  // Set theme with persistence
  const setTheme = async (newTheme: Theme) => {
    console.log(`ThemeContext: Setting theme to: ${newTheme}`);
    setThemeState(newTheme);
    
    // Save theme preference to settings
    try {
      console.log(`ThemeContext: Saving theme preference: ${newTheme}`);
      const result = await ipcRenderer.invoke('set-theme-preference', newTheme);
      console.log('ThemeContext: Theme save result:', result);
    } catch (error) {
      console.error('ThemeContext: Failed to save theme preference:', error);
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log(`ThemeContext: Toggling theme from ${theme} to ${newTheme}`);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
