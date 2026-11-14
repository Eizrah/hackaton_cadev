import { useEffect, useRef, useState } from "react";
import { Mic, Send, Smile, Square, X } from "lucide-react";
import { useI18n } from "../../i18n/context";
import { discardAttachment, saveAttachment, type StoredAttachment } from "../../lib/attachments";
import { AttachmentCard, AttachmentPicker } from "../shared/Attachments";

type Capture = { stream?: MediaStream; recorder?: MediaRecorder; limit?: number };
type Vocal = { status: "opening" | "recording" | "finishing" } | {
  status: "review" | "saving";
  file: File;
  url: string;
};

function releaseCapture({ recorder, stream, limit }: Capture) {
  if (limit !== undefined) window.clearTimeout(limit);
  if (recorder) {
    recorder.ondataavailable = null;
    recorder.onstop = null;
    recorder.onerror = null;
    if (recorder.state !== "inactive") recorder.stop();
  }
  stream?.getTracks().forEach(track => track.stop());
}

export default function MessageComposer({ onSend }: { onSend: (text: string, attachments: StoredAttachment[]) => Promise<boolean> }) {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<StoredAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const [vocal, setVocal] = useState<Vocal | null>(null);
  const [error, setError] = useState("");
  const capture = useRef<Capture | null>(null);
  const mounted = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const hasDraft = !!text.trim() || attachments.length > 0;
  const review = vocal && "file" in vocal ? vocal : null;
  const reviewUrl = review?.url;
  const recordLabel = t("Enregistrer un message vocal", "Record a voice message");
  const sendLabel = t("Envoyer le message", "Send message");

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      const current = capture.current;
      capture.current = null;
      if (current) releaseCapture(current);
    };
  }, []);
  useEffect(() => () => { if (reviewUrl) URL.revokeObjectURL(reviewUrl); }, [reviewUrl]);

  function clearVocal() {
    const current = capture.current;
    capture.current = null;
    if (current) releaseCapture(current);
    setVocal(null);
    setError("");
  }

  async function startVocal() {
    if (capture.current || vocal || uploading) return;
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError(t("Le micro est indisponible ici. Ouvre la messagerie sur localhost ou en HTTPS avec un navigateur compatible.", "The microphone is unavailable here. Open messages on localhost or HTTPS in a supported browser."));
      return;
    }
    const current: Capture = {};
    capture.current = current;
    setEmoji(false);
    setVocal({ status: "opening" });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      current.stream = stream;
      if (capture.current !== current) {
        releaseCapture(current);
        return;
      }
      const format = ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/mp4"]
        .find(type => MediaRecorder.isTypeSupported(type));
      const recorder = format ? new MediaRecorder(stream, { mimeType: format }) : new MediaRecorder(stream);
      current.recorder = recorder;
      const chunks: Blob[] = [];
      let size = 0;

      recorder.ondataavailable = ({ data }) => {
        if (capture.current !== current || !data.size) return;
        size += data.size;
        if (size > 10 * 1024 * 1024) {
          clearVocal();
          setError(t("Le vocal dépasse 10 Mo. Réessaie avec un enregistrement plus court.", "The voice message exceeds 10 MB. Try a shorter recording."));
        } else {
          chunks.push(data);
        }
      };
      recorder.onerror = () => {
        if (capture.current !== current) return;
        clearVocal();
        setError(t("L’enregistrement a été interrompu. Réessaie.", "Recording was interrupted. Try again."));
      };
      recorder.onstop = () => {
        if (capture.current !== current) return;
        capture.current = null;
        releaseCapture(current);
        if (!size) {
          setVocal(null);
          setError(t("Aucun son n’a été enregistré. Réessaie.", "No audio was recorded. Try again."));
          return;
        }
        const type = (recorder.mimeType || chunks[0].type || "audio/webm").split(";")[0];
        const extension = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
        const file = new File(chunks, `${t("Message vocal", "Voice message")}.${extension}`, { type });
        setVocal({ status: "review", file, url: URL.createObjectURL(file) });
      };
      recorder.start(1000);
      current.limit = window.setTimeout(stopVocal, 149_000);
      setVocal({ status: "recording" });
    } catch (err) {
      if (capture.current !== current) return;
      clearVocal();
      const denied = err instanceof DOMException && err.name === "NotAllowedError";
      setError(denied
        ? t("Autorise l’accès au micro dans ton navigateur pour enregistrer un vocal.", "Allow microphone access in your browser to record a voice message.")
        : t("Impossible de démarrer le micro. Vérifie qu’un micro est disponible et réessaie.", "Could not start the microphone. Check that a microphone is available and try again."));
    }
  }

  function stopVocal() {
    const recorder = capture.current?.recorder;
    if (recorder?.state === "recording") {
      setVocal({ status: "finishing" });
      recorder.stop();
    }
  }

  async function sendVocal() {
    if (review?.status !== "review") return;
    setVocal({ ...review, status: "saving" });
    setError("");
    let saved: StoredAttachment | undefined;
    try {
      saved = await saveAttachment(review.file);
      if (!mounted.current) {
        await discardAttachment(saved.id);
        return;
      }
      const sent = await onSend("", [saved]);
      void discardAttachment(saved.id).catch(() => {});
      if (mounted.current) setVocal(sent ? null : review);
    } catch {
      if (!mounted.current) return;
      if (saved) void discardAttachment(saved.id).catch(() => {});
      setVocal(review);
      setError(t("Impossible de conserver le vocal sur cet appareil. Réessaie.", "Could not save the voice message on this device. Try again."));
    }
  }

  async function sendDraft(event: React.FormEvent) {
    event.preventDefault();
    if (!hasDraft || uploading || vocal || sending) return;
    setSending(true);
    try {
      if (await onSend(text.trim(), attachments) && mounted.current) {
        setText("");
        setAttachments([]);
        setEmoji(false);
        setError("");
      }
    } finally {
      if (mounted.current) setSending(false);
    }
  }

  return <form className="room-composer" onSubmit={event => void sendDraft(event)}>
    {attachments.length > 0 && <div className="chat-draft-files">
      {attachments.map(file => <AttachmentCard
        key={file.id}
        file={file}
        preview={false}
        onRemove={sending ? undefined : () => setAttachments(current => current.filter(other => other.id !== file.id))} />)}
    </div>}
    {emoji && <div className="emoji-choices">
      {["👋", "✨", "🚀", "👍", "😊", "💻"].map(symbol => <button type="button" key={symbol} onClick={() => {
        setText(value => (value + symbol).slice(0, 10000));
        setEmoji(false);
        input.current?.focus();
      }}>{symbol}</button>)}
    </div>}
    {vocal ? <div className="room-composer-row voice-composer-row">
      <button type="button" className="room-emoji" disabled={vocal.status === "saving"}
        onClick={clearVocal} aria-label={t("Annuler le vocal", "Cancel voice message")}><X size={20} /></button>
      {review ? <audio controls preload="metadata" src={review.url} aria-label={t("Écouter le vocal", "Listen to voice message")} />
        : <span className="voice-status" role="status">
          {vocal.status === "recording" ? t("Enregistrement en cours", "Recording")
            : vocal.status === "opening" ? t("Accès au micro…", "Opening microphone…")
              : t("Préparation du vocal…", "Preparing voice message…")}
        </span>}
      {vocal.status === "recording" && <button type="button" className="send-message" onClick={stopVocal}
        aria-label={t("Arrêter l’enregistrement", "Stop recording")}><Square size={18} /></button>}
      {review && <button type="button" className="send-message" disabled={vocal.status === "saving"} onClick={() => void sendVocal()}
        aria-label={t("Envoyer le vocal", "Send voice message")}><Send size={20} /></button>}
    </div> : <div className="room-composer-row">
      <AttachmentPicker
        label={t("Joindre un fichier", "Attach a file")}
        multiple
        onBusy={setUploading}
        onAdd={selected => { setAttachments(current => [...current, ...selected].slice(0, 5)); setError(""); }} />
      <button type="button" className="room-emoji" aria-expanded={emoji}
        aria-label={t("Ajouter un emoji", "Add an emoji")} onClick={() => setEmoji(!emoji)}><Smile size={20} /></button>
      <input ref={input} value={text} maxLength={10000} disabled={sending} onChange={event => { setText(event.target.value); setError(""); }}
        placeholder={t("Écrire un message…", "Write a message…")}
        aria-label={t("Écrire un message", "Write a message")} />
      {hasDraft ? <button key="send" type="submit" className="send-message" disabled={uploading || sending} aria-label={sendLabel} title={sendLabel}>
        <Send size={21} />
      </button> : <button key="voice" type="button" className="send-message record-message" disabled={uploading}
        onClick={() => void startVocal()} aria-label={recordLabel} title={recordLabel}><Mic size={21} /></button>}
    </div>}
    {error && <p className="form-error voice-error" role="alert">{error}</p>}
  </form>;
}
