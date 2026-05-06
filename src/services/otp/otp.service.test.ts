import { endPoints } from "@/routes/endpoints";
import { api, handleApiError } from "@/services/api";
import { createOtp, verifyOtp, updatePassword } from "@/services/otp/otp.service";

jest.mock("@/services/api", () => ({
  __esModule: true,
  api: {
    post: jest.fn(),
    patch: jest.fn(),
  },
  handleApiError: jest.fn((error: unknown) => {
    throw error;
  }),
}));

describe("otpService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOtp", () => {
    it("deve solicitar a criação de um OTP", async () => {
      (api.post as jest.Mock).mockResolvedValueOnce(undefined);

      await createOtp("test@example.com");

      expect(api.post).toHaveBeenCalledWith(endPoints.otp.create, {
        email: "test@example.com",
      });
    });

    it("deve delegar erros ao handleApiError", async () => {
      const error = new Error("Failed to create OTP");
      (api.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(createOtp("test@example.com")).rejects.toThrow("Failed to create OTP");
      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("verifyOtp", () => {
    it("deve verificar o OTP com sucesso", async () => {
      const mockResponse = {
        token: "mock-token",
        user: { id: "1", name: "User" },
      };
      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await verifyOtp("test@example.com", "123456");

      expect(api.post).toHaveBeenCalledWith(endPoints.otp.verify, {
        email: "test@example.com",
        otp: "123456",
      });
      expect(result).toEqual(mockResponse);
    });

    it("deve delegar erros ao handleApiError", async () => {
      const error = new Error("Invalid OTP");
      (api.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(verifyOtp("test@example.com", "123456")).rejects.toThrow("Invalid OTP");
      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("updatePassword", () => {
    it("deve atualizar a senha usando o token de recuperação", async () => {
      (api.patch as jest.Mock).mockResolvedValueOnce(undefined);

      await updatePassword("recovery-token", "new-secure-password");

      expect(api.patch).toHaveBeenCalledWith(
        endPoints.users.updatePassword,
        { newPassword: "new-secure-password" },
        {
          headers: {
            Authorization: "Bearer recovery-token",
          },
        }
      );
    });

    it("deve delegar erros ao handleApiError", async () => {
      const error = new Error("Failed to update password");
      (api.patch as jest.Mock).mockRejectedValueOnce(error);

      await expect(updatePassword("recovery-token", "new-secure-password")).rejects.toThrow(
        "Failed to update password"
      );
      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });
});
