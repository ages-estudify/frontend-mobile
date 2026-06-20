import api from "@/services/api";
import { profilePictureService } from "./profilePicture.service";

jest.mock("@/services/api", () => ({
  __esModule: true,
  default: {
    patch: jest.fn(),
    delete: jest.fn(),
  },
  handleApiError: jest.fn((e: unknown) => e),
}));

const mockApi = api as jest.Mocked<typeof api>;

describe("profilePictureService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("update", () => {
    it("should PATCH and return profilePictureUrl on success", async () => {
      const url = "https://cdn.example.com/avatar.jpg";
      mockApi.patch.mockResolvedValueOnce({
        data: { profilePictureUrl: url },
      });

      const result = await profilePictureService.update("data:image/jpeg;base64,abc123");

      expect(mockApi.patch).toHaveBeenCalledWith("/users/profile-picture", {
        image: "data:image/jpeg;base64,abc123",
      });
      expect(result.profilePictureUrl).toBe(url);
    });

    it("should throw a handled error when the request fails", async () => {
      mockApi.patch.mockRejectedValueOnce(new Error("Server error"));

      await expect(profilePictureService.update("data:image/jpeg;base64,abc")).rejects.toThrow(
        "Server error"
      );
    });
  });

  describe("remove", () => {
    it("should DELETE the profile picture endpoint", async () => {
      mockApi.delete.mockResolvedValueOnce({});

      await profilePictureService.remove();

      expect(mockApi.delete).toHaveBeenCalledWith("/users/profile-picture");
    });

    it("should throw a handled error when DELETE fails", async () => {
      mockApi.delete.mockRejectedValueOnce(new Error("Network error"));

      await expect(profilePictureService.remove()).rejects.toThrow("Network error");
    });
  });
});
