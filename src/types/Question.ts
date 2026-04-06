export type Alternative = {
  label: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  imageUrl?: string | null;
  type: "ORIGINAL" | "SIMPLIFIED";
  foreing: boolean;
  subjectName: string;
  topicName: string;
  alternatives: Alternative[];
};

export type FetchQuestionsResponse = {
  data: {
    questions: Question[];
    sessionProgress: {
      current: number;
      total: number;
    };
  } | null;
  message?: string;
}