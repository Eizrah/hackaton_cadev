import { useLayoutEffect, useRef } from "react";
import { BadgeCheck, GraduationCap } from "lucide-react";
import type { CredentialAttachment } from "../../data/profile";
import { useI18n } from "../../i18n/context";
import { AttachmentCard, AttachmentPicker } from "./Attachments";
export default function CredentialFields({ value, onChange, onBusy }: { value: CredentialAttachment[]; onChange: (value: CredentialAttachment[]) => void; onBusy?: (busy: boolean) => void }) {
  const { t } = useI18n();
  const latest = useRef(value);
  useLayoutEffect(() => { latest.current = value; }, [value]);
  function update(next: CredentialAttachment[]) { latest.current = next; onChange(next); }
  return <div className="credential-fields">
    {(["diploma", "certificate"] as const).map(kind => <section
      className="credential-field"
      key={kind}>
      <h4>
        {kind === "diploma" ? <GraduationCap size={18} /> : <BadgeCheck size={18} />}{" "}
        {kind === "diploma" ? t("Diplôme (facultatif)", "Diploma (optional)") : t("Certificat (facultatif)", "Certificate (optional)")}
      </h4>
      <AttachmentPicker
        onBusy={onBusy}
        label={kind === "diploma" ? t("Joindre un diplôme", "Attach a diploma") : t("Joindre un certificat", "Attach a certificate")}
        accept=".pdf,.doc,.docx,image/*"
        multiple
        onAdd={files => update([...latest.current, ...files.map(file => ({ id: file.id, kind, file }))])} />
      {value.filter(d => d.kind === kind).map(d => <AttachmentCard
        file={d.file}
        preview={false}
        key={d.id}
        onRemove={() => update(latest.current.filter(item => item.id !== d.id))} />)}
    </section>)}
  </div>;
}
