import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProgressoRoute from "../../app/(tabs)/progresso";
import { useUserStats } from "@/hooks/useUserStats";
import { useAuth } from "@/hooks/useAuth";
import { populatedUserStatsMock, emptyUserStatsMock } from "@/mocks/userStatsMock";

// Mock das dependências
jest.mock("@/hooks/useUserStats");
jest.mock("@/hooks/useAuth");
jest.mock("../../src/components/navigation/PlanGuard", () => ({
  PlanGuard: ({ children }: any) => <>{children}</>,
}));
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => <>{children}</>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
    get: jest.fn(),
    post: jest.fn(),
  })),
  isAxiosError: jest.fn(),
}));
// Mock do GatedTabScreenHeader e outros componentes complexos que podem falhar no jest-native se não tratados, mas como o jest já lida bem, vamos focar no mock dos hooks.

describe("ProgressoRoute (Meu Progresso)", () => {
  const mockUseUserStats = useUserStats as jest.Mock;
  const mockUseAuth = useAuth as jest.Mock;
  const mockRetry = jest.fn();
  const mockRefreshStats = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ logout: jest.fn() });
  });

  it("renders loading state initially", () => {
    mockUseUserStats.mockReturnValue({
      data: null,
      loading: true,
      error: false,
      refreshing: false,
      refreshStats: mockRefreshStats,
      retry: mockRetry,
    });

    const { getByTestId, queryByText } = render(<ProgressoRoute />);
    // Verifica se o título da página renderiza mesmo carregando
    expect(queryByText("Meu Progresso")).toBeTruthy();
    // O ActivityIndicator deve estar presente, mas por ser um componente interno do react-native não possui texto, podemos tentar achar o texto "Sua evolução nos estudos" que não deve estar lá ainda
    expect(queryByText("Sua evolução nos estudos")).toBeNull();
  });

  it("renders error state and handles retry", () => {
    mockUseUserStats.mockReturnValue({
      data: null,
      loading: false,
      error: true,
      refreshing: false,
      refreshStats: mockRefreshStats,
      retry: mockRetry,
    });

    const { getByText } = render(<ProgressoRoute />);
    expect(getByText("Algo deu errado. Tente novamente.")).toBeTruthy();

    const retryBtn = getByText("Tentar novamente");
    fireEvent.press(retryBtn);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it("renders success state with populated data", () => {
    mockUseUserStats.mockReturnValue({
      data: populatedUserStatsMock.data,
      loading: false,
      error: false,
      refreshing: false,
      refreshStats: mockRefreshStats,
      retry: mockRetry,
    });

    const { getByText } = render(<ProgressoRoute />);
    expect(getByText("Sua evolução nos estudos")).toBeTruthy();
    expect(getByText("Progresso Geral")).toBeTruthy();
    expect(getByText("Simulado ENEM | Janeiro")).toBeTruthy();
  });

  it("renders success state with empty data", () => {
    mockUseUserStats.mockReturnValue({
      data: emptyUserStatsMock.data,
      loading: false,
      error: false,
      refreshing: false,
      refreshStats: mockRefreshStats,
      retry: mockRetry,
    });

    const { getByText, queryByText } = render(<ProgressoRoute />);
    expect(getByText("Sua evolução nos estudos")).toBeTruthy();
    expect(getByText("Progresso Geral")).toBeTruthy();
    expect(getByText("Você ainda não tem simulados")).toBeTruthy();
    // A lista de subjects deve estar vazia, sem acertos de matemática, etc., pois ou a lista tá vazia ou está com 0s.
  });
});
