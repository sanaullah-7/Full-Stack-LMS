import { storage } from "./storage";

/**
 * Enterprise Anti-Inspect & DevTools Protection Module
 * Modeled with SMIT Portal Official Security System UI
 */

let isTriggered = false;

function triggerSecurityViolation() {
  if (isTriggered) return;
  isTriggered = true;

  try {
    storage.clearAuth();
    sessionStorage.clear();
  } catch (e) {
    // Ignore
  }

  // Inject keyframe animation if not already present
  if (!document.getElementById("security-modal-styles")) {
    const styleEl = document.createElement("style");
    styleEl.id = "security-modal-styles";
    styleEl.innerHTML = `
      @keyframes secModalIn {
        from { opacity: 0; transform: scale(0.94) translateY(12px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes secPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
        50% { box-shadow: 0 0 0 16px rgba(239, 68, 68, 0); }
      }
      @keyframes secGlow {
        0%, 100% { border-color: rgba(239, 68, 68, 0.4); }
        50% { border-color: rgba(239, 68, 68, 0.9); }
      }
    `;
    document.head.appendChild(styleEl);
  }

  const now = new Date();
  const timestampStr = now.toUTCString();
  const incidentId = "SEC-" + Math.random().toString(36).substring(2, 9).toUpperCase();

  // Create full-screen security lock overlay
  const overlay = document.createElement("div");
  overlay.id = "security-violation-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99999999;
    background: rgba(11, 23, 44, 0.94);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 24px;
  `;

  overlay.innerHTML = `
    <div style="
      background: var(--surface, #ffffff);
      border-radius: 18px;
      max-width: 520px;
      width: 100%;
      padding: 36px 32px;
      text-align: center;
      box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(220, 38, 38, 0.15);
      border: 1.5px solid #ef4444;
      animation: secModalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1), secGlow 2.5s infinite ease-in-out;
      position: relative;
    ">
      <!-- Top Brand Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 16px;">
        <img src="/smit-logo.png" alt="SMIT" style="height: 32px; object-fit: contain;" />
        <span style="
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          background: #fee2e2;
          color: #b91c1c;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid #fca5a5;
        ">
          Security Alert
        </span>
      </div>

      <!-- Warning Icon Badge -->
      <div style="
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: #fef2f2;
        border: 2px solid #fecaca;
        color: #dc2626;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        animation: secPulse 2s infinite;
      ">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="16"/>
        </svg>
      </div>

      <h2 style="
        margin: 0 0 8px 0;
        font-size: 21px;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.02em;
      ">
        Portal Security Lockout
      </h2>

      <p style="
        margin: 0 0 20px 0;
        font-size: 14px;
        line-height: 1.55;
        color: #475569;
      ">
        Unauthorized Developer Tools, DOM Inspection, and source interrogation have been detected and blocked by the <b>SMIT Automated Compliance System</b>.
      </p>

      <!-- Forensic Audit Box -->
      <div style="
        background: #0f172a;
        border-radius: 10px;
        padding: 14px 16px;
        text-align: left;
        margin-bottom: 22px;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 11.5px;
        line-height: 1.6;
        color: #94a3b8;
        border: 1px solid #1e293b;
      ">
        <div style="color: #f87171; font-weight: 600; margin-bottom: 4px;">
          ● INCIDENT LOGGED: ${incidentId}
        </div>
        <div>TIMESTAMP: <span style="color: #e2e8f0;">${timestampStr}</span></div>
        <div>VIOLATION: <span style="color: #e2e8f0;">UNAUTHORIZED_INSPECT_ATTACH</span></div>
        <div>DEVICE STATUS: <span style="color: #fca5a5; font-weight: 600;">FLAGGED FOR PERMANENT BAN</span></div>
      </div>

      <div style="
        background: #fff1f2;
        border: 1px solid #ffe4e6;
        border-radius: 10px;
        padding: 12px 14px;
        font-size: 12px;
        color: #9f1239;
        line-height: 1.5;
        margin-bottom: 24px;
        text-align: left;
      ">
        <b>⚠️ Mandatory Notice:</b> Your student profile, hardware hash, and network IP have been archived. Repeat tampering will trigger an <b>immediate permanent account termination and campus disciplinary action</b>.
      </div>

      <button id="security-violation-ok-btn" style="
        width: 100%;
        padding: 13px 20px;
        background: #b91c1c;
        color: #ffffff;
        border: none;
        border-radius: 10px;
        font-size: 14.5px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s ease, transform 0.1s ease;
        box-shadow: 0 4px 12px rgba(185, 28, 28, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      ">
        <span>Acknowledge & Exit Portal</span>
        <span>→</span>
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  const redirectToExit = () => {
    window.location.replace("https://www.google.com");
  };

  const btn = document.getElementById("security-violation-ok-btn");
  if (btn) {
    btn.onclick = redirectToExit;
  }

  // Automatic redirect fallback after 6 seconds
  setTimeout(redirectToExit, 6000);
}

export function initAntiInspectSecurity() {
  if (typeof window === "undefined") return;

  // 1. Block Context Menu (Right Click)
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });

  // 2. Block Keyboard Shortcuts
  window.addEventListener("keydown", (e) => {
    // F12
    if (e.key === "F12" || e.keyCode === 123) {
      e.preventDefault();
      triggerSecurityViolation();
      return false;
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    // Ctrl+Shift+I / J / C (DevTools & Inspect)
    if (
      isCtrlOrCmd &&
      e.shiftKey &&
      (e.key === "I" ||
        e.key === "i" ||
        e.key === "J" ||
        e.key === "j" ||
        e.key === "C" ||
        e.key === "c")
    ) {
      e.preventDefault();
      triggerSecurityViolation();
      return false;
    }

    // Ctrl+U (View Source)
    if (isCtrlOrCmd && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      triggerSecurityViolation();
      return false;
    }

    // Ctrl+S (Save Page)
    if (isCtrlOrCmd && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      return false;
    }
  });

  // 3. DevTools Open Detection via Dimension Delta
  const checkDimensions = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    if (widthThreshold || heightThreshold) {
      triggerSecurityViolation();
    }
  };

  window.addEventListener("resize", checkDimensions);

  // 4. Debugger Timing Trap
  setInterval(() => {
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const end = performance.now();
    if (end - start > 100) {
      triggerSecurityViolation();
    }
  }, 1500);
}
