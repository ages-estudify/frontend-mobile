import { endPoints } from "@/routes/endpoints";
import api, { handleApiError } from "../api";

export type GetMeResponse = {
  plan_end_date: string | null;
  onboarding_completed: boolean;
  profile_picture_url: string | null;
};

export const userMeService = {
  async getMe(): Promise<GetMeResponse> {
    try {
      const response: GetMeResponse = await api.get(endPoints.users.me);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
