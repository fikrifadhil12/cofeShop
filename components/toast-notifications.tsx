"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: "bg-green-100 text-green-800 border-green-300",
  error: "bg-red-100 text-red-800 border-red-300",
  info: "bg-blue-100 text-blue-800 border-blue-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

// Komponen dengan ref supaya bisa dipanggil dari luar
export const ToastNotifications = forwardRef((_, ref) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const uniqueToast: Toast = {
      ...toast,
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    };
    setToasts((prev) => [...prev, uniqueToast]);

    if (toast.duration) {
      setTimeout(() => removeToast(uniqueToast.id), toast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // expose addToast supaya bisa dipanggil dari CheckoutForm
  useImperativeHandle(ref, () => ({
    addToast,
  }));

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type];
        return (
          <Card
            key={toast.id}
            className={cn(
              "p-4 shadow-lg animate-in slide-in-from-top-2 pointer-events-auto border",
              toastStyles[toast.type]
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              <span>{toast.message}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
});

ToastNotifications.displayName = "ToastNotifications";
