import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('storyforge-theme', next);
        document.documentElement.setAttribute('data-theme', next);
      }
      return { theme: next };
    }),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('storyforge-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ theme });
  },
}));

// Reader settings store (font size, line height for Reader View)
interface ReaderSettingsState {
  fontSize: number;
  lineHeight: number;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
}

export const useReaderSettingsStore = create<ReaderSettingsState>((set) => ({
  fontSize: 18,
  lineHeight: 1.8,
  setFontSize: (fontSize) => set({ fontSize }),
  setLineHeight: (lineHeight) => set({ lineHeight }),
}));
