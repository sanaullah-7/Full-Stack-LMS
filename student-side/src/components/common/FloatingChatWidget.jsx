import React from "react";
import { MessageSquare } from "lucide-react";
import { showChatComingSoon } from "../../utils/chatAlert";

export const FloatingChatWidget = () => {
  return (
    <div className="floating-chat-container">
      <button
        type="button"
        className="floating-chat-btn"
        onClick={() => showChatComingSoon()}
        title="Student Chat"
        aria-label="Open Chat"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="floating-chat-text">Chat</span>
      </button>
    </div>
  );
};
