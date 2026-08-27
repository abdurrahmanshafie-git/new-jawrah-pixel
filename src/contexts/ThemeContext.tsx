import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = 'jawrah-theme';

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const initialWindow = window as Window & { __JAWRAH_INITIAL_THEME__?: Theme };
  if (isTheme(initialWindow.__JAWRAH_INITIAL_THEME__)) {
    return initialWindow.__JAWRAH_INITIAL_THEME__;
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : 'dark';
  } catch {
    return 'dark';
  }
};

const applyThemeToDom = (nextTheme: Theme) => {
  if (typeof window === 'undefined') {
    return;
  }

  const root = window.document.documentElement;

  root.classList.toggle('light', nextTheme === 'light');
  root.classList.toggle('dark', nextTheme === 'dark');
  root.dataset.theme = nextTheme;
  root.style.colorScheme = nextTheme;

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  themeColorMeta?.setAttribute('content', nextTheme === 'dark' ? '#000000' : '#FFFFFF');

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch {
    // Theme remains applied even when storage is unavailable.
  }
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeState, setThemeState] = useState<Theme>(getInitialTheme);
  const themeRef = React.useRef(themeState);

  useIsomorphicLayoutEffect(() => {
    applyThemeToDom(themeRef.current);

    const root = window.document.documentElement;
    const readyFrame = window.requestAnimationFrame(() => {
      root.classList.add('theme-ready');
    });

    return () => window.cancelAnimationFrame(readyFrame);
  }, []);

  const setTheme = React.useCallback((nextTheme: Theme) => {
    if (!isTheme(nextTheme)) {
      return;
    }

    themeRef.current = nextTheme;
    applyThemeToDom(nextTheme);
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(themeRef.current === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const value = React.useMemo(
    () => ({ theme: themeState, setTheme, toggleTheme }),
    [themeState, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
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
