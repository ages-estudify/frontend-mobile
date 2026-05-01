import api, { handleApiError } from "@/services/api";
import { Exam } from "@/types/exam.types";

interface ExamsResponse {
  success: boolean;
  data: Exam[];
}

function sortExams(exams: Exam[]): Exam[] {
  const order: Record<string, number> = {
    in_progress: 0,
    available: 1,
    completed: 2,
  };
  return [...exams].sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3));
}

export async function getExams(): Promise<Exam[]> {
  try {
    const response = (await api.get<ExamsResponse>("/exams")) as unknown as ExamsResponse;
    return sortExams(response.data);
  } catch (error) {
    handleApiError(error);
    return [];
  }
}
