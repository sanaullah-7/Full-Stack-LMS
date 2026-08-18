import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({
  label,
  defaultOption,
  options,
  value,
  onChange,
  className = "",
  size = "md",
}) {
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState(
    defaultOption || (options && options[0]),
  );
  const [menuStyle, setMenuStyle] = useState(null);
  const ref = useRef(null);
  const menuRef = useRef(null);

  const selected = value !== undefined ? value : internalSelected;
  const listOptions = defaultOption
    ? [defaultOption, ...(options || [])]
    : options || [];

  const updateMenuPosition = useCallback(() => {
    const btn = ref.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;
    const gap = 4;
    const maxMenuH = Math.min(280, viewportH - 16);
    const spaceBelow = viewportH - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
    const available = openUp ? spaceAbove : spaceBelow;
    const height =
      size === "sm"
        ? Math.min(160, Math.max(available, 72))
        : Math.max(120, Math.min(maxMenuH, available));

    const width =
      size === "sm" ? Math.max(rect.width, 92) : Math.max(rect.width, 160);
    let left = size === "sm" ? rect.right - width : rect.left;
    if (left < 8) left = 8;
    if (left + width > viewportW - 8) left = Math.max(8, viewportW - width - 8);

    setMenuStyle({
      position: "fixed",
      left,
      width,
      zIndex: 9999,
      maxHeight: height,
      ...(openUp
        ? { bottom: viewportH - rect.top + gap }
        : { top: rect.bottom + gap }),
    });
  }, [size]);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, listOptions.length, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (e) => {
      if (
        ref.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };

    const onReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, updateMenuPosition]);

  const handleSelect = (opt) => {
    if (onChange) onChange(opt);
    else setInternalSelected(opt);
    setOpen(false);
  };

  const sizeClasses =
    size === "sm"
      ? "px-2 py-1 rounded-md text-xs"
      : "px-4 py-2.5 rounded-lg text-sm";

  const itemSizeClasses =
    size === "sm" ? "px-2 py-1.5 text-xs" : "px-4 py-2 text-sm";

  const widthClasses = size === "sm" ? "w-auto" : "w-full sm:w-auto";

  return (
    <div ref={ref} className={`relative ${widthClasses} ${className}`.trim()}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between gap-2 ${widthClasses} border border-[var(--color-primary)] font-medium cursor-pointer transition-all duration-[var(--duration-fast)] ${sizeClasses} ${
          open
            ? "bg-[var(--color-primary-container)]/10 text-[var(--color-primary)]"
            : "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90"
        }`}
      >
        <span className="truncate">{selected}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-[var(--duration-fast)] ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        menuStyle &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            style={menuStyle}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)] py-1 overflow-y-auto overscroll-contain"
          >
            {listOptions.map((opt, index) => {
              const isSelected = opt === selected;
              return (
                <li
                  key={`${String(opt)}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt)}
                  className={`flex items-center justify-between gap-2 cursor-pointer transition-colors duration-[var(--duration-fast)] ${itemSizeClasses} ${
                    isSelected
                      ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}
