import { endPoints } from "@/routes/endpoints";
import api, { handleApiError } from "../api";

export type UpdateProfilePictureResponse = {
  profilePictureUrl: string;
};

export const profilePictureService = {
  async update(imageBase64: string): Promise<UpdateProfilePictureResponse> {
    try {
      const response = await api.patch<{ data: UpdateProfilePictureResponse }>(
        endPoints.users.profilePicture,
        { image: imageBase64 }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async remove(): Promise<void> {
    try {
      await api.delete(endPoints.users.profilePicture);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
