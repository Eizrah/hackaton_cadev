import {
  AtSign,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  Code2,
  GraduationCap,
  MapPin,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useI18n } from "../i18n/context";
import { africanCountries } from "../data/countries";
import {
  currentYear,
  newExperience,
  newSkill,
  skillDifficulties,
  skillDomains,
  type Experience,
  type DeveloperSkill,
  type PersonalInformation,
} from "../data/profile";
import TechIcon from "./TechIcon";
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
            <option value="" disabled>
              {t("Sélectionner votre niveau", "Select your level")}
            </option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
        </span>
      </label>
      <label>
        {t("Pays", "Country")}
        <span className="onboard-input">
          <MapPin size={18} />
          <select
            name="country"
            autoComplete="country-name"
            value={value.country}
            onChange={(e) => update("country", e.target.value)}
            required
          >
            <option value="" disabled>
              {t("Sélectionner un pays", "Select a country")}
            </option>
            {!africanCountries.includes(value.country) && value.country && (
              <option value={value.country}>{value.country}</option>
            )}
            {africanCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </span>
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
          <h3>{t("Votre parcours compte.", "Your journey matters.")}</h3>
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
        <fieldset className="experience-entry structured-entry" key={row.id}>
          <legend>
            {t("Expérience", "Experience")} {i + 1}
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
            <label>
              {t("Diplôme", "Qualification")}
              <input
                value={row.diploma}
                maxLength={150}
                onChange={(e) => update(row.id, "diploma", e.target.value)}
                placeholder={t(
                  "Facultatif · nom du diplôme",
                  "Optional · qualification name",
                )}
              />
            </label>
            <label className="full-row">
              {t("Certificat", "Certificate")}
              <input
                value={row.certificate}
                maxLength={150}
                onChange={(e) => update(row.id, "certificate", e.target.value)}
                placeholder={t(
                  "Facultatif · nom de la certification",
                  "Optional · certification name",
                )}
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
export function SkillFields({
  value,
  onChange,
}: {
  value: DeveloperSkill[];
  onChange: (value: DeveloperSkill[]) => void;
}) {
  const { t } = useI18n();
  const suggestions = ["React", "Python", "HTML", "CSS", "Figma", "Kotlin"];
  function update(id: string, key: keyof DeveloperSkill, text: string) {
    onChange(
      value.map((row) => (row.id === id ? { ...row, [key]: text } : row)),
    );
  }
  return (
    <div className="structured-fields skill-fields">
      <div className="structured-intro">
        <span className="structured-icon">
          <Code2 size={22} />
        </span>
        <div>
          <h3>
            {t("Ce que vous aimez construire.", "What you like to build.")}
          </h3>
          <p>
            {t(
              "Ajoutez vos compétences avec leur difficulté et leur domaine. Vous pourrez les modifier ensuite.",
              "Add your skills, their difficulty and their field. You can update them later.",
            )}
          </p>
        </div>
      </div>
      <div className="skill-suggestions">
        {suggestions.map((name) => {
          const added = value.some(
            (s) => s.name.trim().toLowerCase() === name.toLowerCase(),
          );
          return (
            <button
              type="button"
              key={name}
              disabled={added}
              onClick={() => onChange([...value, newSkill(name)])}
            >
              <TechIcon name={name} size={17} />
              {name}
              {added ? <Check size={13} /> : <Plus size={13} />}
            </button>
          );
        })}
      </div>
      {value.map((row, i) => (
        <fieldset className="skill-entry structured-entry" key={row.id}>
          <legend>
            <TechIcon name={row.name} size={17} />
            {t("Compétence", "Skill")} {i + 1}
          </legend>
          <button
            type="button"
            className="remove-entry"
            aria-label={`${t("Retirer la compétence", "Remove skill")} ${i + 1}`}
            onClick={() => onChange(value.filter((s) => s.id !== row.id))}
          >
            <Trash2 size={16} />
          </button>
          <div className="professional-grid">
            <label className="full-row">
              {t("Nom de la compétence", "Skill name")}
              <input
                value={row.name}
                onChange={(e) => update(row.id, "name", e.target.value)}
                required
                maxLength={80}
                placeholder={t(
                  "Ex. React, Python, Blender…",
                  "E.g. React, Python, Blender…",
                )}
              />
            </label>
            <label>
              {t("Difficulté", "Difficulty")}
              <select
                required
                value={row.difficulty}
                onChange={(e) => update(row.id, "difficulty", e.target.value)}
              >
                <option value="" disabled>
                  {t("Choisir la difficulté", "Choose difficulty")}
                </option>
                {skillDifficulties.map((d) => (
                  <option value={d} key={d}>
                    {t(
                      d,
                      d === "Facile"
                        ? "Easy"
                        : d === "Intermédiaire"
                          ? "Intermediate"
                          : "Advanced",
                    )}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("Domaine", "Field")}
              <select
                required
                value={row.domain}
                onChange={(e) => update(row.id, "domain", e.target.value)}
              >
                <option value="" disabled>
                  {t("Choisir le domaine", "Choose a field")}
                </option>
                {skillDomains.map((d) => (
                  <option key={d} value={d}>
                    {t(d)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>
      ))}
      <button
        type="button"
        className="add-structured"
        onClick={() => onChange([...value, newSkill()])}
      >
        <Plus size={17} />
        {t("Ajouter une compétence", "Add a skill")}
      </button>
      {!value.length && (
        <p className="structured-note">
          {t(
            "Vous débutez ? Vous pouvez aussi ajouter vos compétences plus tard.",
            "Just starting out? You can also add skills later.",
          )}
        </p>
      )}
    </div>
  );
}
