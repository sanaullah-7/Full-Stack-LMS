import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { KeyRound, Mail, Hash, BookOpen, Layers } from "lucide-react";

export const StudentProfileCard = ({ user, onOpenPasswordModal }) => {
  return (
    <div className="card" style={{ maxWidth: "48rem", margin: "0 auto" }}>
      <div className="card-header" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <div className="avatar" style={{ width: "80px", height: "80px", fontSize: "24px" }}>
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "ST"}
          </div>
          <div>
            <h3 className="card-title" style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>
              {user?.name || "Student Name"}
            </h3>
            <p className="text-sm text-[var(--text-muted)] font-mono mb-4">
              Roll Number: {user?.rollNumber || "N/A"}
            </p>
            <button className="btn-outline" onClick={onOpenPasswordModal} style={{ display: "inline-flex", gap: ".5rem", alignItems: "center" }}>
              <KeyRound className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "0 1.5rem 1.5rem" }}>
        <div style={{ padding: "1rem", borderRadius: "12px", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", gap: ".75rem", alignItems: "center" }}>
          <Mail className="w-5 h-5 text-[var(--accent)]" />
          <div>
            <p style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)" }}>Email Address</p>
            <p style={{ fontSize: "14px", fontWeight: 500 }}>{user?.email || "N/A"}</p>
          </div>
        </div>
        
        <div style={{ padding: "1rem", borderRadius: "12px", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", gap: ".75rem", alignItems: "center" }}>
          <BookOpen className="w-5 h-5 text-[var(--accent)]" />
          <div>
            <p style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)" }}>Enrolled Course</p>
            <p style={{ fontSize: "14px", fontWeight: 500 }}>{user?.course || "Web & Mobile App Development"}</p>
          </div>
        </div>
        
        <div style={{ padding: "1rem", borderRadius: "12px", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", gap: ".75rem", alignItems: "center" }}>
          <Layers className="w-5 h-5 text-[var(--accent)]" />
          <div>
            <p style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)" }}>Batch & Section</p>
            <p style={{ fontSize: "14px", fontWeight: 500 }}>Batch {user?.batch || "01"}</p>
          </div>
        </div>
        
        <div style={{ padding: "1rem", borderRadius: "12px", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", gap: ".75rem", alignItems: "center" }}>
          <Hash className="w-5 h-5 text-[var(--accent)]" />
          <div>
            <p style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)" }}>Account Status</p>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--success)" }}>Active Student</p>
          </div>
        </div>
      </div>
    </div>
  );
};
