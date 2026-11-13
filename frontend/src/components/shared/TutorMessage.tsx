import { Bot, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../../i18n/context";
import type { TutorMessage as TutorMessageType } from "../../lib/agents";

interface TutorMessageProps {
  message: TutorMessageType;
  onResend?: () => void;
}

export default function TutorMessage({ message, onResend }: TutorMessageProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <article className={`floating-tutor-message ${message.role}`}>
      {message.role === "assistant" && (
        <div className="message-avatar">
          <Bot size={16} />
        </div>
      )}
      <div className="message-content">
        <div className="message-header">
          <strong>{message.role === "user" ? t("Toi", "You") : t("Assistant", "Assistant")}</strong>
        </div>
        <div className="message-body">
          {message.content.split(/```(?:[a-zA-Z0-9]+)?\n?/).map((part, i) =>
            i % 2 ? (
              <pre key={i}>
                <code>{part.trim()}</code>
              </pre>
            ) : (
              <p key={i}>{part}</p>
            )
          )}
        </div>
        {message.role === "user" && (
          <div className="message-actions">
            <button
              className="message-action-btn"
              onClick={handleCopy}
              title={t("Copier le message", "Copy message")}
              aria-label={t("Copier le message", "Copy message")}
            >
              {copied ? (
                <span className="action-feedback">✓ {t("Copié", "Copied")}</span>
              ) : (
                <Copy size={13} />
              )}
            </button>
            {onResend && (
              <button
                className="message-action-btn"
                onClick={onResend}
                title={t("Renvoyer ce message", "Resend this message")}
                aria-label={t("Renvoyer ce message", "Resend this message")}
              >
                <RefreshCw size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
