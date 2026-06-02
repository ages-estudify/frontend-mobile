import { renderHook } from "@testing-library/react-native";
import { useStars } from "./useStars";

jest.mock("@/contexts/StarsContext", () => ({
  useStarsContext: jest.fn(),
}));

import { useStarsContext } from "@/contexts/StarsContext";

const mockedUseStarsContext = useStarsContext as jest.Mock;

describe("useStars", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna o valor fornecido pelo StarsContext", () => {
    const loadStars = jest.fn();
    const updateStars = jest.fn();
    const contextValue = {
      stars: 42,
      isLoading: false,
      hasError: false,
      loadStars,
      updateStars,
    };
    mockedUseStarsContext.mockReturnValue(contextValue);

    const { result } = renderHook(() => useStars());

    expect(result.current).toBe(contextValue);
    expect(result.current.stars).toBe(42);
    expect(result.current.loadStars).toBe(loadStars);
    expect(result.current.updateStars).toBe(updateStars);
  });

  it("repassa estado de carregamento e erro", () => {
    mockedUseStarsContext.mockReturnValue({
      stars: null,
      isLoading: true,
      hasError: true,
      loadStars: jest.fn(),
      updateStars: jest.fn(),
    });

    const { result } = renderHook(() => useStars());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasError).toBe(true);
    expect(result.current.stars).toBeNull();
  });

  it("propaga o erro quando usado fora do provider", () => {
    mockedUseStarsContext.mockImplementation(() => {
      throw new Error("useStarsContext must be used within StarsProvider");
    });

    expect(() => renderHook(() => useStars())).toThrow(
      "useStarsContext must be used within StarsProvider"
    );
  });
});
