import type { GetStarsResponse } from "@/types/stars.types";
import api, { handleApiError } from "./api";

export const getUserStars = async (): Promise<GetStarsResponse> => {
  try {
    const response: GetStarsResponse = await api.get("/users/me/coins");
    return response;
  } catch (error) {
    handleApiError(error);
  }
};
