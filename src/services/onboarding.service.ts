import { endPoints } from "@/routes/endpoints";
import type { OnboardingRequest } from "@/types/onboarding.types";
import { api, handleApiError } from "./api";

export const onboardingService = {
  submit: async (body: OnboardingRequest): Promise<void> => {
    try {
      await api.post(endPoints.onboarding.submit, body);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

/**
 * export async function getQuestions({
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
 */
