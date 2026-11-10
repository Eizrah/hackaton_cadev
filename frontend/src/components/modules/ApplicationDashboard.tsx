import { useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  CircleX,
} from "lucide-react";
import { useApplications } from "../../data/workflow";
import { initialJobs, migrateJobs, type Profile } from "../../data/models";
import { useLocalData } from "../../lib/storage";
import { useI18n } from "../../i18n/context";
export default function ApplicationDashboard({profile}: {profile:Profile}) {
  const { t, locale } = useI18n();
  const [applications] = useApplications();
  const [jobs] = useLocalData("jobs", initialJobs, migrateJobs);
  const [filter, setFilter] = useState("all");
  const statuses = {
    pending: { label: t("En cours", "In progress"), Icon: Clock3 },
    accepted: { label: t("Validée", "Accepted"), Icon: CheckCircle2 },
    rejected: { label: t("Non retenue", "Not selected"), Icon: CircleX },
  };
  const visible = applications.filter(
    (a) => a.applicantId === profile.id && (filter === "all" || a.status === filter),
  );
  return (
    <section className="applications-dashboard panel" id="candidatures">
      <div className="section-title">
        <span className="round-icon">
          <BriefcaseBusiness size={20} />
        </span>
        <div>
          <h2>{t("Mes candidatures", "My applications")}</h2>
          <p>
            {t(
              "Retrouve les offres auxquelles tu as postulé et leur état.",
              "Follow the jobs you applied for and their status.",
            )}
          </p>
        </div>
      </div>
      <div className="application-filters">
        {[
          ["all", t("Toutes", "All")],
          ["pending", t("En cours", "In progress")],
          ["accepted", t("Validées", "Accepted")],
          ["rejected", t("Non retenues", "Not selected")],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={filter === key ? "active" : ""}
            aria-pressed={filter === key}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="applications-list">
        {visible.map((a) => {
          const state = statuses[a.status],
            job = jobs.find((j) => j.id === a.jobId);
          return (
            <article
              className={`application-card status-${a.status}`}
              key={a.id}
            >
              <div>
                <span className="application-company">
                  {job?.company || a.company}
                </span>
                <h3>{job?.title || a.title}</h3>
                <small>
                  {a.sentAt
                    ? new Intl.DateTimeFormat(locale, {
                        dateStyle: "medium",
                      }).format(new Date(a.sentAt))
                    : t("Date non renseignée", "Date unavailable")}
                </small>
              </div>
              <div className="application-progress">
                <span className="application-status">
                  <state.Icon size={14} />
                  {state.label}
                </span>
                <div className="status-track" aria-label={state.label}>
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {!visible.length && (
        <div className="applications-empty">
          <BriefcaseBusiness size={25} />
          <p>
            {t(
              "Aucune candidature dans cette catégorie.",
              "No applications in this category.",
            )}
          </p>
          <a href="#workspace/offres">
            {t("Découvrir les offres", "Explore jobs")}
            <ArrowUpRight size={15} />
          </a>
        </div>
      )}
      <small className="muted">
        {t(
          "Les candidatures sont locales ; les décisions réelles seront fournies par Django.",
          "Applications are local; actual decisions will come from Django.",
        )}
      </small>
    </section>
  );
}
