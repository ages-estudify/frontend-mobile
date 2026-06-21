import { endPoints } from "@/routes/endpoints";
import type {
  UpdateUserPreferencesRequest,
  UpdateUserPreferencesResponse,
} from "@/types/userPreferences.types";
import { api, handleApiError } from "../api";

export const userPreferencesService = {
  update: async (body: UpdateUserPreferencesRequest): Promise<UpdateUserPreferencesResponse> => {
    try {
      const response = await api.patch(endPoints.users.preferences, body);
      return response as UpdateUserPreferencesResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
