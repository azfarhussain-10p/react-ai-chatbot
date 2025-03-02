import React from "react";

// src/utils/errorHandling.ts
export type ErrorType = 
  | "API" 
  | "NETWORK" 
  | "VALIDATION" 
  | "PROCESSING" 
  | "CONFIGURATION"
  | "AUTHENTICATION";

export type ErrorCode =
  | "MISSING_API_KEY"
  | "INVALID_MODEL"
  | "RATE_LIMIT_EXCEEDED"
  | "NETWORK_FAILURE"
  | "OPENAI_API_ERROR"
  | "GEMINI_API_ERROR"
  | "DEEPSEEK_API_ERROR"
  | "VALIDATION_ERROR"
  | "RATE_LIMIT_EXCEEDED"
  | "RESPONSE_PARSING";

export interface ErrorMetadata {
  service?: string;
  model?: string;
  statusCode?: number;
  timestamp?: Date;
}

export class ChatError extends Error {
  public readonly code: ErrorCode;
  public readonly type: ErrorType;
  public readonly metadata: ErrorMetadata;
  public readonly retryable: boolean;
  public readonly userAction?: string;

  constructor(
    type: ErrorType,
    code: ErrorCode,
    message: string,
    options: {
      metadata?: ErrorMetadata;
      retryable?: boolean;
      userAction?: string;
    } = {}
  ) {
    super(message);
    this.name = "ChatError";
    this.type = type;
    this.code = code;
    this.metadata = {
      timestamp: new Date(),
      ...options.metadata,
    };
    this.retryable = options.retryable ?? true;
    this.userAction = options.userAction;
    Object.setPrototypeOf(this, ChatError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      code: this.code,
      message: this.message,
      metadata: this.metadata,
      retryable: this.retryable,
      userAction: this.userAction,
      stack: this.stack,
    };
  }
}

// Error Handling Utilities
export const handleError = (error: unknown, context?: string): void => {
  if (error instanceof ChatError) {
    console.error(`[${error.type}] ${error.code}: ${error.message}`, {
      context,
      ...error.metadata,
    });
    
    if (error.userAction) {
      alert(`Error: ${error.message}\nSuggested Action: ${error.userAction}`);
    }
  } else {
    console.error("[UNKNOWN] Unexpected error:", error, { context });
  }
};

export const setupGlobalErrorHandling = () => {
  window.addEventListener("error", (event) => {
    handleError(event.error, "GlobalError");
  });

  window.addEventListener("unhandledrejection", (event) => {
    handleError(event.reason, "UnhandledRejection");
  });
};

// Validation Utilities
export const validateApiKey = (key: string, service: string): void | never => {
  if (!key || key.trim() === "") {
    throw new ChatError(
      "VALIDATION",
      "MISSING_API_KEY",
      `API key required for ${service}`,
      {
        metadata: { service },
        userAction: "Check your API keys in settings",
        retryable: false,
      }
    );
  }
};

export const validateModelType = (
  model: string,
  validModels: string[]
): void | never => {
  if (!validModels.includes(model)) {
    throw new ChatError(
      "VALIDATION",
      "INVALID_MODEL",
      `Unsupported model: ${model}`,
      {
        metadata: { model },
        userAction: "Choose from supported models: " + validModels.join(", "),
        retryable: false,
      }
    );
  }
};

// Type Guards
export const isNetworkError = (error: unknown): error is ChatError => {
  return error instanceof ChatError && error.type === "NETWORK";
};

export const isValidationError = (error: unknown): error is ChatError => {
  return error instanceof ChatError && error.type === "VALIDATION";
};

// Error Boundary Component (For React)
export class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    handleError(error, "ReactErrorBoundary");
    console.error("Component stack:", info.componentStack);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}