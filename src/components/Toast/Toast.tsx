// src/components/Toast/Toast.tsx
import { JSX, useEffect } from 'react';
import styles from './Toast.module.css';

type ToastProps = {
  message: string;
  type: 'error' | 'success' | 'warning';
  onDismiss: () => void;
};

export function Toast({ message, type, onDismiss }: ToastProps): JSX.Element {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={onDismiss} aria-label="Close">
        ×
      </button>
    </div>
  );
}