import type { StudyHoursMap } from "./onboarding.types";

export type PreferredLanguage = "ENGLISH" | "SPANISH";

export type UpdateUserPreferencesRequest = {
  name?: string;
  desiredCourse?: string;
  desiredUniversity?: string;
  preferredLanguage?: PreferredLanguage;
  studyHours?: StudyHoursMap;
};

export type UpdateUserPreferencesResponse = {
  message: string;
};
