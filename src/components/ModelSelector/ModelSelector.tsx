import { ChangeEvent } from "react";
import styles from "./ModelSelector.module.css";
import type { ModelType } from "../../assistants";
import { MODEL_DISPLAY_NAMES } from "../../assistants/factory";

export function ModelSelector({
  selectedModel,
  onModelChange,
}: {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onModelChange(e.target.value as ModelType);
  };

  return (
    <div className={styles.modelSelector}>
      <label htmlFor="model-select">AI Model:</label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={handleChange}
        className={styles.select}
      >
        {Object.entries(MODEL_DISPLAY_NAMES).map(([key, name]) => (
          <option key={key} value={key}>{name}</option>
        ))}
      </select>
    </div>
  );
}