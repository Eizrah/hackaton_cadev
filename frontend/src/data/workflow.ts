import type { StoredAttachment } from "../lib/attachments";
import { initialProfile, migrateProfile, type Profile } from "./profile";
import { useLocalData } from "../lib/storage";
export type Application = {
  cvFile?:StoredAttachment;
  applicantId: string; applicant: Profile; ownerId: string; cvUrl: string; motivation: string; updatedAt?: string;

  id: number;
  jobId: number;
  title: string;
  company: string;
  status: "pending" | "accepted" | "rejected";
  sentAt: string | null;
};
export function migrateApplications(saved: unknown): Application[] {
  if (!Array.isArray(saved)) return [];
  return saved.flatMap((value) =>
    typeof value === "number"
      ? [
          {
            applicantId: "dev-juliana", applicant: initialProfile, ownerId: "", cvUrl: "", motivation: "",
            id: value,
            jobId: value,
            title: "Candidature",
            company: "Organisation non renseignée",
            status: "pending" as const,
            sentAt: null,
          },
        ]
      : value && typeof value === "object" && typeof value.jobId === "number"
        ? [
            {
              ...value,
              applicantId: typeof value.applicantId === "string" ? value.applicantId : "dev-juliana",
              applicant: migrateProfile(value.applicant || initialProfile),
              ownerId: typeof value.ownerId === "string" ? value.ownerId : "",
              cvUrl: typeof value.cvUrl === "string" ? value.cvUrl : "",
              motivation: typeof value.motivation === "string" ? value.motivation : "",
              status: ["pending", "accepted", "rejected"].includes(value.status)
                ? value.status
                : "pending",
            },
          ]
        : [],
  );
}
export function useApplications() {
  return useLocalData<Application[]>("applications", [], migrateApplications);
}
export type Review = {
  id: string;
  kind: "post" | "offer" | "report";
  resourceId: number;
  title: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  decision?: string;
};
export function useReviews() {
  return useLocalData<Review[]>("reviews", []);
}
export function makeReview(
  kind: Review["kind"],
  resourceId: number,
  title: string,
  content: string,
): Review {
  return {
    id: `${kind}-${resourceId}`,
    kind,
    resourceId,
    title,
    content,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}
export function checkContent(content: string) {
  return content.trim().length < 8 ||
    /<script|javascript:|spam\s*spam/i.test(content)
    ? {
        status: "rejected" as const,
        reason:
          "Vérification locale : contenu trop court ou motif technique à revoir.",
      }
    : {
        status: "approved" as const,
        reason:
          "Vérification locale : structure lisible. Aucun modèle IA de modération n’a été appelé.",
      };
}
