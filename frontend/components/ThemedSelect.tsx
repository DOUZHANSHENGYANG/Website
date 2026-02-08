import React, { useEffect, useMemo, useRef, useState } from 'react';

type SelectValue = string | number;

export interface ThemedSelectOption<T extends SelectValue = SelectValue> {
  value: T;
  label: string;
  icon?: string;
}

interface ThemedSelectProps<T extends SelectValue = SelectValue> {
  value: T;
  options: Array<ThemedSelectOption<T>>;
  onChange: (value: T) => void;
  className?: string;
  placement?: 'top' | 'bottom';
  size?: 'sm' | 'md';
}

export const ThemedSelect = <T extends SelectValue>({
  value,
  options,
  onChange,
  className = '',
  placement = 'bottom',
  size = 'md'
}: ThemedSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((item) => item.value === value) || options[0],
    [options, value]
  );

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDocumentClick);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  const triggerSizeClass = size === 'sm'
    ? 'text-xs px-3 py-1.5 rounded-lg'
    : 'text-sm px-4 py-2.5 rounded-xl';

  const panelPositionClass = placement === 'top'
    ? 'bottom-full mb-2'
    : 'top-full mt-2';

  return (
    <div ref={wrapperRef} className={`relative isolate ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full ${triggerSizeClass} bg-slate-100/80 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 flex items-center justify-between gap-2 hover:border-primary/40 focus-visible:border-primary/50 transition-all duration-200`}
      >
        <span className="flex items-center gap-2 min-w-0">
          {selected?.icon && <span className="material-symbols-outlined text-primary text-[18px]">{selected.icon}</span>}
          <span className="truncate">{selected?.label}</span>
        </span>
        <span className={`material-symbols-outlined text-slate-400 dark:text-white/40 transition-transform ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {open && (
        <div className={`absolute ${panelPositionClass} left-0 right-0 z-[300] max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#121826]/95 backdrop-blur-xl shadow-2xl p-2 custom-scrollbar`}>
          {options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                option.value === value
                  ? 'bg-primary text-white'
                  : 'text-slate-700 dark:text-white/75 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {option.icon && <span className="material-symbols-outlined text-[18px]">{option.icon}</span>}
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
