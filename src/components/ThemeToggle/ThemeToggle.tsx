// src/components/ThemeToggle/ThemeToggle.tsx
import { JSX } from 'react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps): JSX.Element {
  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className={styles.switch} data-theme={theme}>
        {theme === 'light' ? (
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6m0-14v4m-7.07.93l2.83 2.83M4 12h4m-.93 7.07l2.83-2.83M12 20v-4m7.07-.93l-2.83-2.83M20 12h-4m.93-7.07l-2.83 2.83"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 3c.2 0 .4.1.5.2.3.3.2.8-.1 1.1-1.1 1.1-1.7 2.6-1.7 4.1 0 3.6 2.9 6.5 6.5 6.5.7 0 1.3-.1 1.9-.3.3-.1.6 0 .8.2.2.3.2.6 0 .8-2.6 2.6-6.9 2.6-9.5 0s-2.6-6.9 0-9.5c.2-.2.5-.3.8-.2.3.1.5.4.5.7z"/>
          </svg>
        )}
      </div>
    </button>
  );
}