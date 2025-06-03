// src/hooks/useDarkMode.js
import { useEffect, useState } from 'react';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) return storedTheme === 'dark';

  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return systemPrefersDark;
};

const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return [darkMode, toggleDarkMode];
};

export default useDarkMode;
