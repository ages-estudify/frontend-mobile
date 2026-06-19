import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProgressoRoute from "./progresso";
import { useUserStats } from "@/hooks/useUserStats";
import { useAuth } from "@/hooks/useAuth";
import { populatedUserStatsMock, emptyUserStatsMock } from "@/mocks/userStatsMock";

jest.mock("@/hooks/useUserStats");
jest.mock("@/hooks/useAuth");
jest.mock("@/components/navigation/PlanGuard", () => ({
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
    expect(queryByText("Meu Progresso")).toBeTruthy();
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
  });
});
