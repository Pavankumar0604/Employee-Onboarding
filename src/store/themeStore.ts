import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  isAutomatic: boolean;
  setTheme: (theme: Theme) => void;
  setAutomatic: (isAutomatic: boolean) => void;
}

// Helper function to get system theme preference
const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Helper function to apply theme to DOM
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),
      isAutomatic: false,

      setTheme: (newTheme: Theme) => {
        set({ theme: newTheme, isAutomatic: false });
        applyTheme(newTheme);
      },

      setAutomatic: (isAutomatic: boolean) => {
        if (isAutomatic) {
          // When automatic is enabled, use system theme
          const systemTheme = getSystemTheme();
          set({ isAutomatic: true, theme: systemTheme });
          applyTheme(systemTheme);

          // Listen for system theme changes
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = (e: MediaQueryListEvent) => {
            const newTheme: Theme = e.matches ? 'dark' : 'light';
            const state = get();
            if (state.isAutomatic) {
              set({ theme: newTheme });
              applyTheme(newTheme);
            }
          };

          // Store the listener so we can remove it later
          mediaQuery.addEventListener('change', handleChange);

          // Clean up when automatic is disabled
          return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
          // When automatic is disabled, keep current theme but stop listening
          set({ isAutomatic: false });
        }
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply theme from storage on load
          if (state.isAutomatic) {
            const systemTheme = getSystemTheme();
            state.theme = systemTheme;
            applyTheme(systemTheme);

            // Re-setup system theme listener
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
              const newTheme: Theme = e.matches ? 'dark' : 'light';
              if (state.isAutomatic) {
                state.theme = newTheme;
                applyTheme(newTheme);
              }
            };
            mediaQuery.addEventListener('change', handleChange);
          } else {
            applyTheme(state.theme);
          }
        }
      },
    }
  )
);

// Initialize theme on app load
if (typeof window !== 'undefined') {
  const store = useThemeStore.getState();
  if (store.isAutomatic) {
    const systemTheme = getSystemTheme();
    useThemeStore.setState({ theme: systemTheme });
    applyTheme(systemTheme);
  } else {
    applyTheme(store.theme);
  }
}