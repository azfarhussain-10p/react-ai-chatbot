import { useState, ChangeEvent, KeyboardEvent, JSX, useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styles from "./Controls.module.css";

interface ControlsProps {
  isDisabled?: boolean;
  onSend: (content: string) => void;
}

export function Controls({
  isDisabled = false,
  onSend,
}: ControlsProps): JSX.Element {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (!isDisabled) {
      textareaRef.current?.focus();
    }
  }, [isDisabled]);

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    setContent(event.target.value);
  }

  function handleContentSend(): void {
    if (content.length > 0) {
      onSend(content);
      setContent("");
    }
  }

  function handleEnterPress(
    event: KeyboardEvent<HTMLTextAreaElement>
  ): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleContentSend();
    }
  }

  return (
    <div className={styles.Controls}>
      <div className={styles.TextAreaContainer}>
        <TextareaAutosize
          ref={textareaRef}
          className={styles.TextArea}
          disabled={isDisabled}
          placeholder="Message AI Chatbot"
          value={content}
          minRows={1}
          maxRows={4}
          onChange={handleContentChange}
          onKeyDown={handleEnterPress}
        />
      </div>
      <button
        className={styles.Button}
        disabled={isDisabled}
        onClick={handleContentSend}
      >
        <SendIcon />
      </button>
    </div>
  );
}

function SendIcon(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#5f6368"
    >
      <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
    </svg>
  );
}
