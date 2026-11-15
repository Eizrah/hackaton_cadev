import { Bot, Copy, RefreshCw, Check } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../../i18n/context";
import type { TutorMessage as TutorMessageType } from "../../lib/agents";

interface TutorMessageProps {
  message: TutorMessageType;
  onResend?: () => void;
}

export default function TutorMessage({ message, onResend }: TutorMessageProps) {
  const { t } = useI18n();
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeIndex(index);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const parts = message.content.split(/```(?:[a-zA-Z0-9]+)?\n?/);

  return (
    <article className={`floating-tutor-message ${message.role}`}>
      {message.role === "assistant" && (
        <div className="message-avatar">
          <Bot size={16} />
        </div>
      )}
      {message.role === "assistant" ? (
        <div className="message-content">
          <div className="message-header">
            <strong>{t("Assistant", "Assistant")}</strong>
          </div>
          <div className="message-body">
            {parts.map((part, i) =>
              i % 2 ? (
                <div key={i} className="code-block-wrapper">
                  <button
                    className="code-copy-btn"
                    onClick={() => handleCopyCode(part.trim(), i)}
                    title={t("Copier le code", "Copy code")}
                  >
                    {copiedCodeIndex === i ? (
                      <Check size={12} />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                  <pre>
                    <code>{part.trim()}</code>
                  </pre>
                </div>
              ) : (
                part.trim() && <p key={i}>{part}</p>
              )
            )}
          </div>
          <div className="message-actions">
            <button
              className="message-action-btn icon-only"
              onClick={() => handleCopy(message.content)}
              title={t("Copier le message", "Copy message")}
              aria-label={t("Copier le message", "Copy message")}
            >
              {copiedMessage ? <Check size={11} /> : <Copy size={11} />}
            </button>
          </div>
        </div>
      ) : (
        <div className="user-message-wrapper">
          <div className="message-body">
            <p>{message.content}</p>
          </div>
          <div className="message-actions user-message-actions">
            <button
              className="message-action-btn icon-only"
              onClick={() => handleCopy(message.content)}
              title={t("Copier le message", "Copy message")}
              aria-label={t("Copier le message", "Copy message")}
            >
              {copiedMessage ? <Check size={11} /> : <Copy size={11} />}
            </button>
            {onResend && (
              <button
                className="message-action-btn icon-only"
                onClick={onResend}
                title={t("Renvoyer ce message", "Resend this message")}
                aria-label={t("Renvoyer ce message", "Resend this message")}
              >
                <RefreshCw size={11} />
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
