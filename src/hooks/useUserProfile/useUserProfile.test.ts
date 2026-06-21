import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useUserProfile } from "./useUserProfile";

jest.mock("@/services/userProfile/userProfile.storage", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require("react");
    React.useEffect(() => {
      const cleanup = callback();
      return typeof cleanup === "function" ? cleanup : undefined;
    }, [callback]);
  },
}));

import { getUserProfile } from "@/services/userProfile/userProfile.storage";

const mockGetUserProfile = getUserProfile as jest.Mock;

describe("useUserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("carrega o perfil ao focar a tela", async () => {
    mockGetUserProfile.mockResolvedValueOnce({
      fullName: "Ana Silva",
      email: "ana@test.com",
    });

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetUserProfile).toHaveBeenCalled();
    expect(result.current.profile).toEqual({
      fullName: "Ana Silva",
      email: "ana@test.com",
    });
  });

  it("updateProfile mescla campos parciais no estado", async () => {
    mockGetUserProfile.mockResolvedValueOnce({
      fullName: "Ana Silva",
      email: "ana@test.com",
    });

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.updateProfile({ profilePictureUrl: "https://cdn.example.com/pic.jpg" });
    });

    expect(result.current.profile).toEqual({
      fullName: "Ana Silva",
      email: "ana@test.com",
      profilePictureUrl: "https://cdn.example.com/pic.jpg",
    });
  });

  it("reload atualiza o perfil manualmente", async () => {
    mockGetUserProfile
      .mockResolvedValueOnce({ fullName: "Ana Silva" })
      .mockResolvedValueOnce({ fullName: "Ana Atualizada" });

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => expect(result.current.profile?.fullName).toBe("Ana Silva"));

    await act(async () => {
      await result.current.reload();
    });

    expect(result.current.profile?.fullName).toBe("Ana Atualizada");
  });
});
