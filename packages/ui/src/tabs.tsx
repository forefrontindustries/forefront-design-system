import type { ReactNode } from "react";
import { useId, useRef, useState } from "react";

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Uncontrolled starting tab. Defaults to the first enabled tab. */
  defaultId?: string;
  onChange?: (id: string) => void;
  /** Accessible name for the tab list. */
  label: string;
}

/**
 * Tabs.
 *
 * Keyboard model is the WAI-ARIA authoring practice, not a guess:
 *  - roving tabindex, so Tab enters the list once and moves on to the panel
 *  - ArrowLeft/ArrowRight move selection, Home/End jump to the ends
 *  - disabled tabs are skipped, and selection follows focus (automatic activation),
 *    which is correct here because panels are cheap and already rendered
 */
export function Tabs({ items, defaultId, onChange, label }: TabsProps) {
  const enabled = items.filter((item) => !item.disabled);
  const [active, setActive] = useState(defaultId ?? enabled[0]?.id ?? items[0]?.id ?? "");
  const base = useId();
  const listRef = useRef<HTMLDivElement | null>(null);

  const select = (id: string) => {
    setActive(id);
    onChange?.(id);
    requestAnimationFrame(() => {
      listRef.current?.querySelector<HTMLButtonElement>(`[data-tab-id="${id}"]`)?.focus();
    });
  };

  const move = (direction: 1 | -1 | "first" | "last") => {
    if (enabled.length === 0) return;
    if (direction === "first") return select(enabled[0]!.id);
    if (direction === "last") return select(enabled[enabled.length - 1]!.id);
    const current = enabled.findIndex((item) => item.id === active);
    const next = (current + direction + enabled.length) % enabled.length;
    select(enabled[next]!.id);
  };

  return (
    <div>
      <div className="fds-tabs-list" role="tablist" aria-label={label} ref={listRef}>
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              className="fds-tab"
              data-tab-id={item.id}
              id={`${base}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  move(1);
                } else if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  move(-1);
                } else if (event.key === "Home") {
                  event.preventDefault();
                  move("first");
                } else if (event.key === "End") {
                  event.preventDefault();
                  move("last");
                }
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          className="fds-tab-panel"
          id={`${base}-panel-${item.id}`}
          aria-labelledby={`${base}-tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
