import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get initial theme from localStorage or default to the black theme
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jawrah-theme');
      if (stored) {
        return stored as Theme;
      }
      return 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    // Update DOM and localStorage when theme changes
    const root = window.document.documentElement;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    
    // Remove both classes then add new one
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Update meta theme-color
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#000000' : '#FFFFFF');
    }
    
    // Save to localStorage
    localStorage.setItem('jawrah-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
