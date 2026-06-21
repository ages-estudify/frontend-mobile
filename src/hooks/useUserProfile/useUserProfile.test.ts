import { useAuthSession } from "@/contexts/AuthContext";
import { userProfileService } from "@/services/userProfile/userProfile.service";
import { getUserProfile, saveUserProfile } from "@/services/userProfile/userProfile.storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useUserProfile } from "./useUserProfile";

jest.mock("@/contexts/AuthContext", () => ({
  useAuthSession: jest.fn(),
}));

jest.mock("@/services/userProfile/userProfile.service", () => ({
  userProfileService: {
    getCurrent: jest.fn(),
  },
}));

jest.mock("@/services/userProfile/userProfile.storage", () => ({
  getUserProfile: jest.fn(),
  saveUserProfile: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
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

const mockSetSessionFromCredentials = jest.fn();
const mockUpdatePlanSession = jest.fn();
const mockGetUserProfile = getUserProfile as jest.Mock;
const mockGetCurrent = userProfileService.getCurrent as jest.Mock;
const mockSaveUserProfile = saveUserProfile as jest.Mock;

describe("useUserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAuthSession as jest.Mock).mockReturnValue({
      setSessionFromCredentials: mockSetSessionFromCredentials,
      updatePlanSession: mockUpdatePlanSession,
    });
  });

  it("carrega o perfil mesclando storage e API ao focar a tela", async () => {
    mockGetUserProfile.mockResolvedValueOnce({
      fullName: "Ana Silva",
      email: "ana@test.com",
      studyHours: { MONDAY: [8] },
    });
    mockGetCurrent.mockResolvedValueOnce({
      fullName: "Ana Silva Atualizada",
      email: "ana@test.com",
      role: "USER",
      planStatus: "active",
      planEndDate: "2026-12-31",
      desiredCourse: "Medicina",
    });

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetUserProfile).toHaveBeenCalled();
    expect(mockGetCurrent).toHaveBeenCalled();
    expect(result.current.profile).toEqual({
      fullName: "Ana Silva Atualizada",
      email: "ana@test.com",
      role: "USER",
      planStatus: "active",
      planEndDate: "2026-12-31",
      desiredCourse: "Medicina",
      studyHours: { MONDAY: [8] },
    });
    expect(mockUpdatePlanSession).toHaveBeenCalledWith({
      planExpirationDate: "2026-12-31",
      planActive: true,
    });
    expect(mockSetSessionFromCredentials).toHaveBeenCalledWith("USER", "2026-12-31", true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("role", "USER");
    expect(mockSaveUserProfile).toHaveBeenCalled();
  });

  it("expõe erro quando a API falha", async () => {
    mockGetUserProfile.mockResolvedValueOnce(null);
    mockGetCurrent.mockRejectedValueOnce(new Error("Falha na rede"));

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Falha na rede");
    expect(result.current.profile).toBeNull();
  });

  it("normaliza mensagens de erro desconhecidas", async () => {
    mockGetUserProfile.mockResolvedValueOnce(null);
    mockGetCurrent.mockRejectedValueOnce("timeout");

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => expect(result.current.error).toBe("timeout"));
  });

  it("usa mensagem genérica para erro sem detalhes", async () => {
    mockGetUserProfile.mockResolvedValueOnce(null);
    mockGetCurrent.mockRejectedValueOnce({});

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => expect(result.current.error).toBe("Algo deu errado. Tente novamente."));
  });

  it("usa message de erro em objetos da API", async () => {
    mockGetUserProfile.mockResolvedValueOnce(null);
    mockGetCurrent.mockRejectedValueOnce({ message: "API indisponível" });

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => expect(result.current.error).toBe("API indisponível"));
  });

  it("reload atualiza o perfil manualmente", async () => {
    mockGetUserProfile
      .mockResolvedValueOnce({ fullName: "Ana Silva" })
      .mockResolvedValueOnce({ fullName: "Ana Atualizada" });
    mockGetCurrent
      .mockResolvedValueOnce({ fullName: "Ana Silva", role: "USER", planStatus: "inactive" })
      .mockResolvedValueOnce({
        fullName: "Ana Atualizada",
        role: "USER",
        planStatus: "inactive",
      });

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => expect(result.current.profile?.fullName).toBe("Ana Silva"));

    await act(async () => {
      await result.current.reload();
    });

    expect(result.current.profile?.fullName).toBe("Ana Atualizada");
  });
});
