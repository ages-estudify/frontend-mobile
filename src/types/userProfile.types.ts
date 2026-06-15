import type { StudyHoursMap } from "./onboarding.types";

export type UserProfile = {
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  role?: string;
  planEndDate?: string | null;
  planStatus?: string;
  preferredLanguage?: string;
  desiredCourse?: string;
  desiredUniversity?: string;
  studyHours?: StudyHoursMap;
};

export type UserProfileUpdate = Partial<UserProfile>;

export type UserProfileApiResponse = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  role: string;
  plan_end_date: string | null;
  desired_course: string | null;
  preferred_language: string | null;
  desired_university: string | null;
  birth_date: string | null;
  plan_status: string;
};
