import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type ToastTone = "neutral" | "success" | "warning" | "danger";

export interface ToastOptions {
  title: string;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milliseconds before auto dismiss. Pass 0 to require a manual dismiss. */
  duration?: number;
}

interface ToastRecord extends ToastOptions {
  id: number;
}

interface ToastApi {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** Cap on visible toasts. Older ones drop off so the viewport never buries the page. */
  max?: number;
  children_?: never;
}

/**
 * ToastProvider.
 *
 * Accessibility contract:
 *  - one aria-live region, polite for neutral and success, assertive for danger
 *  - every toast has a real dismiss button, because auto dismiss alone fails WCAG 2.2.1
 *  - default duration is 6s, long enough to read at 200 words per minute
 */
export function ToastProvider({ children, max = 3 }: ToastProviderProps) {
  const [items, setItems] = useState<ToastRecord[]>([]);
  const next = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = next.current++;
      setItems((current) => [...current, { ...options, id }].slice(-max));
      const duration = options.duration ?? 6000;
      if (duration > 0) timers.current.set(id, setTimeout(() => dismiss(id), duration));
      return id;
    },
    [dismiss, max],
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  const urgent = items.some((item) => item.tone === "danger");

  return (
    <ToastContext.Provider value={api}>
      {children}
      <section
        className="fds-toast-viewport"
        aria-label="Notifications"
        aria-live={urgent ? "assertive" : "polite"}
      >
        {items.map((item) => (
          <div key={item.id} className="fds-toast" data-tone={item.tone ?? undefined}>
            <div>
              <div className="fds-toast-title">{item.title}</div>
              {item.description ? <div>{item.description}</div> : null}
            </div>
            <button
              type="button"
              className="fds-button fds-focusable"
              data-variant="ghost"
              data-size="sm"
              aria-label={`Dismiss: ${item.title}`}
              onClick={() => dismiss(item.id)}
            >
              Close
            </button>
          </div>
        ))}
      </section>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside <ToastProvider>");
  return api;
}
