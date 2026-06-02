import { renderHook } from "@testing-library/react-native";
import { useStreak } from "./useStreak";

jest.mock("@/contexts/StreakContext", () => ({
  useStreakContext: jest.fn(),
}));

import { useStreakContext } from "@/contexts/StreakContext";

const mockedUseStreakContext = useStreakContext as jest.Mock;

describe("useStreak", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna o valor fornecido pelo StreakContext", () => {
    const loadStreak = jest.fn();
    const updateStreak = jest.fn();
    const contextValue = {
      streakDays: 7,
      streakActive: true,
      isLoading: false,
      hasError: false,
      loadStreak,
      updateStreak,
    };
    mockedUseStreakContext.mockReturnValue(contextValue);

    const { result } = renderHook(() => useStreak());

    expect(result.current).toBe(contextValue);
    expect(result.current.streakDays).toBe(7);
    expect(result.current.streakActive).toBe(true);
    expect(result.current.loadStreak).toBe(loadStreak);
    expect(result.current.updateStreak).toBe(updateStreak);
  });

  it("repassa estado de carregamento e erro", () => {
    mockedUseStreakContext.mockReturnValue({
      streakDays: null,
      streakActive: null,
      isLoading: true,
      hasError: true,
      loadStreak: jest.fn(),
      updateStreak: jest.fn(),
    });

    const { result } = renderHook(() => useStreak());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasError).toBe(true);
    expect(result.current.streakDays).toBeNull();
    expect(result.current.streakActive).toBeNull();
  });

  it("propaga o erro quando usado fora do provider", () => {
    mockedUseStreakContext.mockImplementation(() => {
      throw new Error("useStreakContext must be used within StreakProvider");
    });

    expect(() => renderHook(() => useStreak())).toThrow(
      "useStreakContext must be used within StreakProvider"
    );
  });
});
