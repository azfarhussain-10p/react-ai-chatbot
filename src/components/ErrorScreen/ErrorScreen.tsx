import { JSX } from 'react';
import styles from './ErrorScreen.module.css';

export function ErrorScreen() {
  return (
    <div className={styles.container}>
      <h1>Something went wrong</h1>
      <p>Please refresh the page or try again later.</p>
      <button 
        className={styles.button}
        onClick={() => window.location.reload()}
      >
        Reload Application
      </button>
    </div>
  );
}