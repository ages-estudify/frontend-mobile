import { renderHook } from "@testing-library/react-native";
import { useInitializeStars } from "./useInitializeStars";

jest.mock("../useStars", () => ({
  useStars: jest.fn(),
}));

import { useStars } from "../useStars";

const mockedUseStars = useStars as jest.Mock;

describe("useInitializeStars", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("chama loadStars na montagem", () => {
    const loadStars = jest.fn();
    mockedUseStars.mockReturnValue({ loadStars });

    renderHook(() => useInitializeStars());

    expect(loadStars).toHaveBeenCalledTimes(1);
  });

  it("nao chama loadStars novamente em re-render quando a referencia e estavel", () => {
    const loadStars = jest.fn();
    mockedUseStars.mockReturnValue({ loadStars });

    const { rerender } = renderHook(() => useInitializeStars());
    rerender({});

    expect(loadStars).toHaveBeenCalledTimes(1);
  });
});
