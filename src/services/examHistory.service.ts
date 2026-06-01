import { endPoints } from "@/routes/endpoints";
import { ExamHistory } from "@/types/exam-history.types";
import api, { handleApiError } from "./api";

export const examHistoryService = {
  history: async (examId: string): Promise<ExamHistory> => {
    try {
      const response: ExamHistory = await api.get(endPoints.exams.history(examId));
      return response;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return {
          success: true,
          data: {
            exam: { id: examId, name: "", origin: "" },
            summary: { averageScore: 0, totalCompleted: 0 },
            history: [],
          },
        };
      }
      handleApiError(error);
      throw error;
    }
  },
};
