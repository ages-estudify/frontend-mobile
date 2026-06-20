import type { StudyDay, StudyHoursMap } from "@/types/onboarding.types";

export const STUDY_DAY_LABELS: Record<StudyDay, string> = {
  MONDAY: "Seg",
  TUESDAY: "Ter",
  WEDNESDAY: "Quar",
  THURSDAY: "Qui",
  FRIDAY: "Sex",
  SATURDAY: "Sab",
  SUNDAY: "Dom",
};

const STUDY_DAY_ORDER: StudyDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export function formatPreferredLanguage(language?: string): string {
  if (!language) return "—";
  if (language === "ENGLISH") return "Inglês";
  if (language === "SPANISH") return "Espanhol";
  return language;
}

export function formatStudyHourLabel(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export function getSelectedStudyDays(studyHours?: StudyHoursMap): StudyDay[] {
  if (!studyHours) return [];

  return STUDY_DAY_ORDER.filter((day) => {
    const hours = studyHours[day];
    return Array.isArray(hours) && hours.length > 0;
  });
}

export function getUniqueStudyHours(studyHours?: StudyHoursMap): number[] {
  if (!studyHours) return [];

  const uniqueHours = new Set<number>();

  Object.values(studyHours).forEach((hours) => {
    hours?.forEach((hour) => uniqueHours.add(hour));
  });

  return [...uniqueHours].sort((hourA, hourB) => hourA - hourB);
}
