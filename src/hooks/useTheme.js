import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'priorme_theme';

export function useTheme() {
  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem(THEME_KEY) === 'light';
  });

  useEffect(() => {
    document.body.classList.toggle('light', isLight);
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  }, [isLight]);

  const toggleTheme = useCallback(() => {
    setIsLight((prev) => !prev);
  }, []);

  return { isLight, toggleTheme };
}
