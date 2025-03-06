// (untouched)
// Purpose: Define the notification context and provider for the app.

"use client";

// Import the required modules.
import { createContext, useContext, useState, ReactNode } from "react";

// Define the notification types.
type NotificationType = "success" | "error" | "warning" | "info";

// Define the notification context type.
interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

// Create the notification context.
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Define the notification provider component.
export function NotificationProvider({ children }: { children: ReactNode }) {
  // Define the state for the notification.
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    id: number;
  } | null>(null);

  // Define the function to show a notification.
  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 3000);
  };

  // Return the notification provider with the notification
  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className="toast toast-bottom toast-end z-[100]">
          <div className={`alert ${getAlertClass(notification.type)}`}>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

// Define the function to get the alert class based on the notification type.
function getAlertClass(type: NotificationType): string {
  switch (type) {
    case "success":
      return "alert-success";
    case "error":
      return "alert-error";
    case "warning":
      return "alert-warning";
    case "info":
      return "alert-info";
    default:
      return "alert-info";
  }
}

// Define the custom hook to use the notification context.
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
