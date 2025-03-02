// src/utils/notifications.ts
import { useToast } from '../contexts/ToastContext';
import type { ModelType } from "../assistants";
import { getModelDisplayName } from "../assistants/factory";

export function useNotifications() {
  const { showToast } = useToast();

  const showModelError = (model: ModelType) => {
    showToast({
      message: `Connection failed: ${getModelDisplayName(model)}`,
      type: "error"
    });
  };

  const showRateLimitError = (model: ModelType) => {
    showToast({
      message: `${getModelDisplayName(model)} rate limit exceeded`,
      type: "warning"
    });
  };

  const showUserNotification = (
    message: string, 
    type: 'error' | 'success' | 'warning' = 'error'
  ) => {
    showToast({ message, type });
  };

  const logErrorToService = (error: unknown) => {
    // Add your error logging service integration here
    console.error('Application Error:', error);
    // Example integration with error monitoring service:
    // logErrorToMonitoringService(error);
  };

  return {
    showModelError,
    showRateLimitError,
    showUserNotification,
    logErrorToService,
    showToast
  };
}

// Types for TypeScript
export type NotificationType = ReturnType<typeof useNotifications>;