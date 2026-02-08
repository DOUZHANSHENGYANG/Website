import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'cream';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'cream')) {
      setTheme(savedTheme);
      updateDocumentClass(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      updateDocumentClass('dark');
    }
  }, []);

  const updateDocumentClass = (newTheme: Theme) => {
    // Remove all possible themes
    document.documentElement.classList.remove('dark', 'cream', 'light');
    
    // Add new theme class (except light which is default, but adding 'light' doesn't hurt)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'cream') {
      document.documentElement.classList.add('cream');
    } else {
      document.documentElement.classList.add('light');
    }
  };

  const toggleTheme = () => {
    let newTheme: Theme = 'light';
    if (theme === 'light') newTheme = 'cream';
    else if (theme === 'cream') newTheme = 'dark';
    else newTheme = 'light';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    updateDocumentClass(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
