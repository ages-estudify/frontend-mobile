export type ScheduleDayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type ScheduleItem = {
  id: string;
  scheduledTime: string;
  disciplineId: string;
  disciplineName: string;
  disciplineIcon: string;
  topicId: string;
  topicName: string;
  completed: boolean;
};

export type ScheduleDay = {
  date: string;
  dayOfWeek: ScheduleDayOfWeek;
  items: ScheduleItem[];
};

export type ScheduleWeek = {
  weekStart: string;
  weekEnd: string;
  days: ScheduleDay[];
};

export type ScheduleCreateResponse = {
  data: {
    generatedItems: number;
    firstDate: string;
    lastDate: string;
  };
};

export type ScheduleWeekResponse = {
  data: ScheduleWeek;
};

export type ScheduleCompleteItemResponse = {
  data: {
    itemId: string;
    completed: boolean;
  };
};
