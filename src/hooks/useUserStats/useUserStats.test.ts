import { UserStatsData } from "@/types/userStats";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useUserStats } from "./useUserStats";

jest.mock("@/services/usersStats/usersStatsService", () => ({
  usersStatsService: {
    getUserStats: jest.fn(),
  },
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

import { usersStatsService } from "@/services/usersStats/usersStats.service";

const mockedGetUserStats = usersStatsService.getUserStats as jest.Mock;

const mockStats: UserStatsData = {
  overview: {
    totalAnswered: 100,
    totalCorrect: 80,
    accuracyPercentage: 80,
  },
  level: { current: 3, max: 10 },
  completedTopics: { completed: 5, total: 20 },
  stars: 42,
  streak: 7,
  simulados: [],
  accuracyBySubject: [],
};

describe("useUserStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("carrega as estatisticas no foco e atualiza data", async () => {
    mockedGetUserStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useUserStats());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedGetUserStats).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockStats);
    expect(result.current.error).toBe(false);
  });

  it("define error como true quando o servico falha", async () => {
    mockedGetUserStats.mockRejectedValue(new Error("falha"));

    const { result } = renderHook(() => useUserStats());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it("retry recarrega as estatisticas apos um erro", async () => {
    mockedGetUserStats.mockRejectedValue(new Error("falha"));

    const { result } = renderHook(() => useUserStats());

    await waitFor(() => expect(result.current.error).toBe(true));

    mockedGetUserStats.mockResolvedValue(mockStats);

    await act(async () => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.error).toBe(false);
      expect(result.current.data).toEqual(mockStats);
    });
  });

  it("refreshStats alterna refreshing e mantem os dados", async () => {
    mockedGetUserStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useUserStats());

    await waitFor(() => expect(result.current.data).toEqual(mockStats));

    await act(async () => {
      result.current.refreshStats();
    });

    await waitFor(() => expect(result.current.refreshing).toBe(false));
    expect(result.current.data).toEqual(mockStats);
  });

  it("fetchStats chama o servico diretamente", async () => {
    mockedGetUserStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useUserStats());

    await waitFor(() => expect(result.current.loading).toBe(false));
    mockedGetUserStats.mockClear();

    await act(async () => {
      await result.current.fetchStats();
    });

    expect(mockedGetUserStats).toHaveBeenCalled();
  });
});
