import type { StudyHoursMap } from "./onboarding.types";

export type UserProfile = {
  fullName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  preferredLanguage?: string;
  desiredCourse?: string;
  desiredUniversity?: string;
  studyHours?: StudyHoursMap;
};

export type UserProfileUpdate = Partial<UserProfile>;
