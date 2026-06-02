import { endPoints } from "@/routes/endpoints";
import type { OnboardingRequest } from "@/types/onboarding.types";
import { api, handleApiError } from "../api";

export const onboardingService = {
  submit: async (body: OnboardingRequest): Promise<void> => {
    try {
      await api.post(endPoints.onboarding.submit, body);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
