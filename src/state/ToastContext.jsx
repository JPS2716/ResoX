import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function makeToastId() {
  return `T-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 1000
  )
    .toString()
    .padStart(3, "0")}`;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function pushToast({ title, message }) {
    const id = makeToastId();
    const toast = { id, title: title || "Notice", message: message || "" };
    setToasts((prev) => [toast, ...prev].slice(0, 4));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }

  function dismiss(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const value = useMemo(() => ({ pushToast, dismiss, toasts }), [toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within provider");
  return ctx;
}

export function ToastRegion() {
  const { toasts, dismiss } = useToast();
  if (toasts.length === 0) return null;

  return (
    <div className="toast-region" aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => (
        <div className="toast" key={t.id} role="status">
          <div>
            <p className="toast-title">{t.title}</p>
            <p className="toast-msg">{t.message}</p>
          </div>
          <button className="icon-button" onClick={() => dismiss(t.id)} aria-label="Dismiss toast">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

