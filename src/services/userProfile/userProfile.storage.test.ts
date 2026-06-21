import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearUserProfile, getUserProfile, saveUserProfile } from "./userProfile.storage";

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;

describe("userProfile.storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserProfile", () => {
    it("retorna null quando não há dados salvos", async () => {
      mockGetItem.mockResolvedValueOnce(null);

      await expect(getUserProfile()).resolves.toBeNull();
      expect(mockGetItem).toHaveBeenCalledWith("userProfile");
    });

    it("retorna o perfil parseado do AsyncStorage", async () => {
      mockGetItem.mockResolvedValueOnce(JSON.stringify({ fullName: "Ana", email: "ana@test.com" }));

      await expect(getUserProfile()).resolves.toEqual({
        fullName: "Ana",
        email: "ana@test.com",
      });
    });

    it("retorna null quando o JSON é inválido", async () => {
      mockGetItem.mockResolvedValueOnce("{invalid");

      await expect(getUserProfile()).resolves.toBeNull();
    });
  });

  describe("saveUserProfile", () => {
    it("mescla com o perfil existente e persiste", async () => {
      mockGetItem.mockResolvedValueOnce(JSON.stringify({ fullName: "Ana" }));

      const result = await saveUserProfile({ email: "ana@test.com" });

      expect(result).toEqual({ fullName: "Ana", email: "ana@test.com" });
      expect(mockSetItem).toHaveBeenCalledWith(
        "userProfile",
        JSON.stringify({ fullName: "Ana", email: "ana@test.com" })
      );
    });

    it("cria perfil novo quando não existe cache", async () => {
      mockGetItem.mockResolvedValueOnce(null);

      const result = await saveUserProfile({
        profilePictureUrl: "https://cdn.example.com/pic.jpg",
      });

      expect(result).toEqual({ profilePictureUrl: "https://cdn.example.com/pic.jpg" });
    });
  });

  describe("clearUserProfile", () => {
    it("remove o perfil do AsyncStorage", async () => {
      await clearUserProfile();

      expect(mockRemoveItem).toHaveBeenCalledWith("userProfile");
    });
  });
});
