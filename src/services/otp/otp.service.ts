import { endPoints } from "@/routes/endpoints";
import { LoginResponse } from "@/types/auth.types";
import { api, handleApiError } from "../api";

export const createOtp = async (email: string): Promise<void> => {
  try {
    await api.post(endPoints.otp.create, { email });
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifyOtp = async (email: string, otp: string): Promise<LoginResponse> => {
  try {
    const response: LoginResponse = await api.post(endPoints.otp.verify, { email, otp });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updatePassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await api.patch(
      endPoints.users.updatePassword,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
};
