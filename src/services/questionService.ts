import api, { handleApiError } from "@/services/api";
import { GetQuestionParams, GetQuestionsResponse } from "@/types/Question";

export async function getQuestions({
  topicId,
  type,
  limit = 10,
  excludeAnswered = true,
  retrieveWrong = true,
}: GetQuestionParams): Promise<GetQuestionsResponse> {
  try {
    const response = await api.get<never, GetQuestionsResponse>(
      `/questions/${topicId}`,
      {
        params: {
          type,
          limit,
          excludeAnswered,
          retrieveWrong,
        },
      }
    );
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function postAnswer(
  questionId: string,
  answer: string
): Promise<void> {
  try {
    await api.post(`/questions/${questionId}/answer`, { answer });
  } catch (error) {
    handleApiError(error);
  }
}
