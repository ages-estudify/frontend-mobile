export type StudyDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";
export type StudyHoursMap = Partial<Record<StudyDay, number[]>>;

export interface OnboardingRequest {
  // all fields optional: onboarding can be completed without data
  preferredLanguage?: "ENGLISH" | "SPANISH" | string;
  desiredCourse?: string;
  desiredUniversity?: string;
  studyHours?: StudyHoursMap;
}
