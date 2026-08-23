import React from "react";
import toast from "react-hot-toast";
import { MessageSquare, X } from "lucide-react";

/**
 * Trigger a clean "Coming Soon" notification for the Chat feature.
 * @param {string} [targetName] - Optional name of the person/channel being messaged.
 */
export const showChatComingSoon = (targetName) => {
  const isDirect = Boolean(targetName);
  const title = isDirect ? `Chat with ${targetName}` : "Student & Team Chat";

  toast.custom(
    (t) => (
      <div
        className={`chat-coming-soon-toast ${t.visible ? "animate-enter" : "animate-leave"}`}
        style={{
          background: "var(--surface, #ffffff)",
          color: "var(--text, #0f172a)",
          border: "1px solid var(--border, #e2e8f0)",
          borderRadius: "10px",
          padding: "12px 16px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          maxWidth: "430px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "var(--bg, #f1f5f9)",
            color: "var(--text, #334155)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MessageSquare size={18} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
            <span style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--text, #0f172a)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {title}
            </span>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 600,
                color: "var(--text-muted, #64748b)",
                background: "var(--bg, #f1f5f9)",
                padding: "2px 7px",
                borderRadius: "4px",
                border: "1px solid var(--border, #e2e8f0)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              Coming Soon
            </span>
          </div>

          <p style={{ margin: "3px 0 0 0", fontSize: "12px", color: "var(--text-muted, #64748b)", lineHeight: 1.4, whiteSpace: "normal" }}>
            {isDirect
              ? `Direct messaging with ${targetName} is currently under development.`
              : "Real-time student chat and team discussions are currently under development."}
          </p>
        </div>


        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted, #94a3b8)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>
    ),
    {
      duration: 3500,
      position: "top-center",
    }
  );
};
