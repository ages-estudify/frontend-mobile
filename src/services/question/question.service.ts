import { endPoints } from "@/routes/endpoints";
import api, { handleApiError } from "@/services/api";
import {
  AnswerQuestionResponse,
  GetQuestionParams,
  GetQuestionsResponse,
  TrainingResultApiResponse,
  TrainingResultRequest,
  TrainingResultResponse,
} from "@/types/questions.types";

export async function getQuestions({
  topicId,
  type,
  limit = 10,
  excludeAnswered = true,
  retrieveWrong = true,
}: GetQuestionParams): Promise<GetQuestionsResponse> {
  try {
    const response = await api.get<never, GetQuestionsResponse>(`/questions/${topicId}`, {
      params: {
        type,
        limit,
        excludeAnswered,
        retrieveWrong,
      },
    });
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function postAnswer(
  questionId: string,
  answer: string
): Promise<AnswerQuestionResponse> {
  try {
    const response = await api.post<never, AnswerQuestionResponse>(
      `/questions/${questionId}/answer`,
      { selectedAnswer: answer }
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getTrainingResult(questionIds: string[]): Promise<TrainingResultResponse> {
  try {
    const body: TrainingResultRequest = { questionsIds: questionIds };
    const response = await api.post<never, TrainingResultApiResponse>(
      endPoints.questions.trainingResult,
      body
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
