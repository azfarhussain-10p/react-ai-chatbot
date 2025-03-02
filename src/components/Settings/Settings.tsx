import { JSX } from 'react';
import styles from './Settings.module.css';
import type { ModelType } from '../../assistants';
import { getModelDisplayName, MODEL_DISPLAY_NAMES } from "../../assistants/factory";

export function SettingsPanel({
  isOpen,
  onClose,
  selectedModel,
  onModelChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}): JSX.Element {
  return (
    <div className={`${styles.settingsPanel} ${isOpen ? styles.open : ''}`}>
      <div className={styles.panelHeader}>
        <h2>Settings</h2>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close settings">
          ×
        </button>
      </div>
      
      <div className={styles.settingsSection}>
        <label>AI Model:</label>
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value as ModelType)}
          className={styles.select}
        >
          {Object.entries(MODEL_DISPLAY_NAMES).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}