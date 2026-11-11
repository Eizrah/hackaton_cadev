import {
  AtSign,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Code2,
  GraduationCap,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useI18n } from "../i18n/context";
import SkillSearch from "./shared/SkillSearch";
import CountrySelect from "./shared/CountrySelect";

import {
  currentYear,
  newExperience,
  newSkill,
  type Experience,
  type DeveloperSkill,
  type PersonalInformation,
} from "../data/profile";
import { SkillChip } from "./TechIcon";
import CredentialFields from "./shared/CredentialFields";
import type { CredentialAttachment } from "../data/profile";
import "./profile-fields.css";
export function PersonalFields({
  value,
  onChange,
}: {
  value: PersonalInformation;
  onChange: (value: PersonalInformation) => void;
}) {
  const { t } = useI18n();
  const update = (key: keyof PersonalInformation, text: string) =>
    onChange({ ...value, [key]: text });
  return (
    <div className="personal-fields">
      <label>
        {t("Nom", "Last name")}
        <span className="onboard-input">
          <UserRound size={18} />
          <input
            name="lastName"
            autoComplete="family-name"
            value={value.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            placeholder={t("Votre nom", "Your last name")}
            required
            maxLength={80}
          />
        </span>
      </label>
      <label>
        {t("Prénom", "First name")}
        <span className="onboard-input">
          <UserRound size={18} />
          <input
            name="firstName"
            autoComplete="given-name"
            value={value.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder={t("Votre prénom", "Your first name")}
            required
            maxLength={80}
          />
        </span>
      </label>
      <label>
        {t("Âge", "Age")}
        <span className="onboard-input">
          <CalendarDays size={18} />
          <input
            name="age"
            type="number"
            inputMode="numeric"
            min={1}
            max={120}
            step={1}
            value={value.age}
            onChange={(e) => update("age", e.target.value)}
            placeholder={t("Votre âge", "Your age")}
            required
          />
        </span>
      </label>
      <label>
        {t("Niveau", "Level")}
        <span className="onboard-input">
          <ChartNoAxesColumnIncreasing size={18} />
          <select
            name="level"
            value={value.level}
            onChange={(e) => update("level", e.target.value)}
            required
          >
            <option
              value=""
              disabled>
              {t("Sélectionner votre niveau", "Select your level")}
            </option>
            {["Débutant", "Intermédiaire", "Avancé"].map(level => <option
              key={level}
              value={level}>
              {t(level, level === "Débutant" ? "Beginner" : level === "Intermédiaire" ? "Intermediate" : "Advanced")}
            </option>)}
          </select>
        </span>
      </label>
      <label>
        {t("Pays", "Country")}
        <CountrySelect
          value={value.country}
          onChange={text => update("country", text)} />
      </label>
      <label>
        {t("Pseudo", "Username")}
        <span className="onboard-input">
          <AtSign size={18} />
          <input
            name="pseudo"
            autoComplete="username"
            value={value.pseudo}
            onChange={(e) => update("pseudo", e.target.value)}
            placeholder={t("Votre pseudo", "Your username")}
            required
            minLength={3}
            maxLength={30}
            pattern="[A-Za-z0-9]{3,30}"
            title={t(
              "3 à 30 caractères : lettres et chiffres uniquement.",
              "3–30 characters: letters and numbers only.",
            )}
          />
        </span>
        <small className="field-help">
          {t(
            "Lettres et chiffres uniquement · ex. Juliana23",
            "Letters and numbers only · e.g. Juliana23",
          )}
        </small>
      </label>
    </div>
  );
}
export function ExperienceFields({
  value,
  onChange,
}: {
  value: Experience[];
  onChange: (value: Experience[]) => void;
}) {
  const { t } = useI18n();
  function update(id: string, key: keyof Experience, text: string) {
    onChange(
      value.map((row) => (row.id === id ? { ...row, [key]: text } : row)),
    );
  }
  return (
    <div className="structured-fields experience-fields">
      <div className="structured-intro">
        <span className="structured-icon">
          <BriefcaseBusiness size={22} />
        </span>
        <div>
          <h3>
            {t("Votre parcours compte.", "Your journey matters.")}
          </h3>
          <p>
            {t(
              "Expériences, stages ou projets : partagez ce que vous avez déjà réalisé.",
              "Experience, internships or projects: share what you have done so far.",
            )}
          </p>
        </div>
      </div>
      {!value.length && (
        <div className="structured-empty">
          <span>
            <GraduationCap size={28} />
          </span>
          <strong>
            {t("Chaque parcours a un début.", "Every journey has a beginning.")}
          </strong>
          <p>
            {t(
              "Vous pouvez continuer sans expérience et compléter votre profil plus tard.",
              "You can continue without experience and update your profile later.",
            )}
          </p>
        </div>
      )}
      {value.map((row, i) => (
        <fieldset
          className="experience-entry structured-entry"
          key={row.id}>
          <legend>
            {t("Expérience", "Experience")}
            {" "}
            {i + 1}
          </legend>
          <button
            type="button"
            className="remove-entry"
            aria-label={`${t("Retirer l’expérience", "Remove experience")} ${i + 1}`}
            onClick={() => onChange(value.filter((e) => e.id !== row.id))}
          >
            <Trash2 size={16} />
          </button>
          <div className="professional-grid">
            <label className="full-row">
              {t("Nom du poste", "Position")}
              <input
                value={row.position}
                onChange={(e) => update(row.id, "position", e.target.value)}
                required
                maxLength={120}
                placeholder={t(
                  "Ex. Développeur frontend, projet universitaire…",
                  "E.g. Frontend developer, university project…",
                )}
              />
            </label>
            <label className="full-row">
              {t("Description", "Description")}
              <textarea
                value={row.description}
                onChange={(e) => update(row.id, "description", e.target.value)}
                required
                maxLength={1500}
                placeholder={t(
                  "Vos missions, réalisations et outils utilisés",
                  "Your responsibilities, achievements and tools",
                )}
              />
            </label>
            <label>
              {t("Année de l’expérience", "Experience year")}
              <input
                type="number"
                inputMode="numeric"
                min={1900}
                max={currentYear}
                step={1}
                value={row.year}
                required
                onChange={(e) => update(row.id, "year", e.target.value)}
                placeholder="2026"
              />
            </label>
          </div>
        </fieldset>
      ))}
      <button
        type="button"
        className="add-structured"
        onClick={() => onChange([...value, newExperience()])}
      >
        <Plus size={17} />
        {t("Ajouter une expérience", "Add experience")}
      </button>
    </div>
  );
}
export function SkillFields({ value, onChange, documents = [], onDocumentsChange, onBusy }: { value: DeveloperSkill[]; onChange: (value: DeveloperSkill[]) => void; documents?: CredentialAttachment[]; onDocumentsChange?: (value: CredentialAttachment[]) => void; onBusy?: (busy: boolean) => void }) {
  const { t } = useI18n();
  return <div className="structured-fields skill-fields">
    <div className="structured-intro">
      <span className="structured-icon">
        <Code2 size={22} />
      </span>
      <div>
        <h3>
          {t("Ce que vous aimez construire.", "What you like to build.")}
        </h3>
        <p>
          {t("Recherchez les technologies des cours, ou ajoutez une autre compétence.", "Search technologies from the courses, or add another skill.")}
        </p>
      </div>
    </div>
    <SkillSearch
      selected={value.map(s => s.name)}
      onSelect={name => onChange([...value, newSkill(name)])} />
    {onDocumentsChange && <CredentialFields
      value={documents}
      onChange={onDocumentsChange}
      onBusy={onBusy} />}
    <div className="selected-skills profile-selected-skills">
      {value.map(row => <span key={row.id}>
        <SkillChip name={row.name} />
        <button
          type="button"
          aria-label={`${t("Retirer", "Remove")} ${row.name}`}
          onClick={() => onChange(value.filter(s => s.id !== row.id))}>
          <Trash2 size={15} />
        </button>
      </span>)}
    </div>
    {!value.length && <p className="structured-note">
      {t("Vous pouvez aussi ajouter vos compétences plus tard.", "You can also add your skills later.")}
    </p>}
  </div>;
}
