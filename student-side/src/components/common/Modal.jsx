import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widths = { sm: "420px", md: "520px", lg: "640px", xl: "800px" };

  return createPortal(
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 1400,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(13, 27, 42, 0.4)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)"
        }}
      />

      {/* Modal Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: widths[size] || widths.md,
          maxHeight: "90vh",
          backgroundColor: "var(--surface)",
          borderRadius: "var(--radius-card)",
          boxShadow: "0 25px 50px -12px rgba(13, 27, 42, 0.25), 0 0 0 1px var(--border)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Crucial: prevents content from spilling out and ruining borders
          animation: "modalIn 200ms ease-out"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.75rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0
        }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            margin: 0,
            color: "var(--text)"
          }}>{title}</h3>
          <button
            onClick={onClose}
            className="modal-close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{
          padding: "1.75rem",
          overflowY: "auto",
          flex: 1,
          minHeight: 0
        }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: "1.25rem 1.75rem",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg)",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "0.75rem",
            flexShrink: 0
          }}>
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
};
