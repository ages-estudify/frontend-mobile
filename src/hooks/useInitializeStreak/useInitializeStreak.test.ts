import { renderHook } from "@testing-library/react-native";
import { useInitializeStreak } from "./useInitializeStreak";

jest.mock("@/hooks/useStreak", () => ({
  useStreak: jest.fn(),
}));

import { useStreak } from "@/hooks/useStreak";

const mockedUseStreak = useStreak as jest.Mock;

describe("useInitializeStreak", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("chama loadStreak na montagem", () => {
    const loadStreak = jest.fn().mockResolvedValue(undefined);
    mockedUseStreak.mockReturnValue({ loadStreak });

    renderHook(() => useInitializeStreak());

    expect(loadStreak).toHaveBeenCalledTimes(1);
  });

  it("nao chama loadStreak novamente em re-render quando a referencia e estavel", () => {
    const loadStreak = jest.fn().mockResolvedValue(undefined);
    mockedUseStreak.mockReturnValue({ loadStreak });

    const { rerender } = renderHook(() => useInitializeStreak());
    rerender({});

    expect(loadStreak).toHaveBeenCalledTimes(1);
  });
});
