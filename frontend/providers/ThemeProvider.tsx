'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    const stored = localStorage.getItem('inkveil-theme') as 'light' | 'dark' | null;
    const theme = stored || 'light';
    setTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [setTheme]);

  return <>{children}</>;
}
