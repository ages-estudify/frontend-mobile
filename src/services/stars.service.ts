import api, { handleApiError } from "./api";
import type { GetStarsResponse } from "@/types/stars.types";

export const getUserStars = async (): Promise<GetStarsResponse> => {
  try {
    const response: GetStarsResponse = await api.get("/users/coins");
    return response;
  } catch (error) {
    handleApiError(error);
  }
};
