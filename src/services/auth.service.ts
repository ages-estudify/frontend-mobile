import { endPoints } from "@/routes/endpoints";
import type {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth.types";
import api from "./api";

export const authService = {
  login: async (body: LoginRequest): Promise<LoginResponse> => {
    const response: LoginResponse = await api.post(endPoints.auth.login, body);
    return response;
  },
  register: async (body: RegisterRequest): Promise<RegisterResponse> => {
    const response: RegisterResponse = await api.post(endPoints.auth.register, body);
    return response;
  },
};
