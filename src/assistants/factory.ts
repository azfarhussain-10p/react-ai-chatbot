// src/assistants/factory.ts
import { OpenAIAssistant } from "./openai";
import { GoogleAIAssistant } from "./googleai";
import { DeepSeekAssistant } from "./deepseekai";
import type { ModelType, AssistantConfig } from "./types";
import { ChatError } from "../utils/errorHandling";
import type { ErrorCode } from "../utils/errorHandling";

const ERROR_CONFIG = {
  VALIDATION: {
    NO_API_KEY: (service: string) => `${service} API key is required`,
    INVALID_MODEL: (model: string) => `Invalid model type: ${model}`
  },
  CODES: {
    MISSING_API_KEY: "MISSING_API_KEY" as ErrorCode,
    INVALID_MODEL: "INVALID_MODEL" as ErrorCode
  }
};

// Add model display names mapping
export const MODEL_DISPLAY_NAMES = {
  chatgpt: "GPT-4",
  gemini: "Gemini 1.5 Pro",
  deepseek: "DeepSeek Chat"
} as const;

export function getModelDisplayName(model: ModelType): string {
  return MODEL_DISPLAY_NAMES[model];
}

type ServiceConfig = {
  envVar: string;
  serviceName: string;
  defaultModel: string;
  baseURL?: string;
};

export function createAssistant(model: ModelType, config?: AssistantConfig) {
  const baseConfig: AssistantConfig = {
    apiKey: "",
    baseURL: "",
    model: "",
    ...config
  };

  const validateServiceConfig = (config: ServiceConfig) => {
    const apiKey = baseConfig.apiKey || import.meta.env[config.envVar];
    if (!apiKey) {
      throw new ChatError(
        "VALIDATION", // Error Type
        ERROR_CONFIG.CODES.MISSING_API_KEY, // Error Code
        ERROR_CONFIG.VALIDATION.NO_API_KEY(config.serviceName), // Message
        { retryable: false } // Options
      );
    }

    return {
      apiKey,
      model: baseConfig.model || config.defaultModel,
      baseURL: baseConfig.baseURL || config.baseURL
    };
  };

  switch (model) {
    case "chatgpt": {
      const { apiKey, model: modelName, baseURL } = validateServiceConfig({
        envVar: "VITE_OPENAI_API_KEY",
        serviceName: "OpenAI",
        defaultModel: "gpt-4"
      });
      return new OpenAIAssistant({ apiKey, model: modelName, baseURL });
    }
    case "gemini": {
      const { apiKey, model: modelName } = validateServiceConfig({
        envVar: "VITE_GEMINI_API_KEY",
        serviceName: "Google Gemini",
        defaultModel: "gemini-1.5-pro"
      });
      return new GoogleAIAssistant({ apiKey, model: modelName });
    }
    case "deepseek": {
      const { apiKey, model: modelName } = validateServiceConfig({
        envVar: "VITE_DEEPSEEK_API_KEY",
        serviceName: "DeepSeek",
        defaultModel: "deepseek-chat"
      });
      return new DeepSeekAssistant({ apiKey, model: modelName });
    }

    default: {
      const exhaustiveCheck: never = model;
      throw new ChatError(
        "VALIDATION", // Error Type
        ERROR_CONFIG.CODES.INVALID_MODEL, // Error Code
        ERROR_CONFIG.VALIDATION.INVALID_MODEL(model), // Message
        { retryable: false } // Options
      );
    }
  }
}