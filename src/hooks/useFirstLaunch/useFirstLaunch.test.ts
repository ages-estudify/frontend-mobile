import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useFirstLaunch } from "./useFirstLaunch";

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

describe("useFirstLaunch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("inicia com isFirstLaunch nulo e isLoading verdadeiro", () => {
    mockGetItem.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useFirstLaunch());

    expect(result.current.isFirstLaunch).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it("define isFirstLaunch como true quando nunca viu o slider", async () => {
    mockGetItem.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useFirstLaunch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isFirstLaunch).toBe(true);
    expect(mockGetItem).toHaveBeenCalledWith("hasSeenIntroSlider");
  });

  it("define isFirstLaunch como false quando ja viu o slider", async () => {
    mockGetItem.mockResolvedValueOnce("true");

    const { result } = renderHook(() => useFirstLaunch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isFirstLaunch).toBe(false);
  });

  it("define isFirstLaunch como false quando o AsyncStorage lanca erro", async () => {
    mockGetItem.mockRejectedValueOnce(new Error("falha"));

    const { result } = renderHook(() => useFirstLaunch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isFirstLaunch).toBe(false);
  });

  it("persiste a flag e marca isFirstLaunch como false ao completar a intro", async () => {
    mockGetItem.mockResolvedValueOnce(null);
    mockSetItem.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useFirstLaunch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.completeIntro();
    });

    expect(mockSetItem).toHaveBeenCalledWith("hasSeenIntroSlider", "true");
    expect(result.current.isFirstLaunch).toBe(false);
  });

  it("nao quebra quando setItem falha ao completar a intro", async () => {
    mockGetItem.mockResolvedValueOnce("true");
    mockSetItem.mockRejectedValueOnce(new Error("falha ao salvar"));

    const { result } = renderHook(() => useFirstLaunch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.completeIntro();
    });

    expect(mockSetItem).toHaveBeenCalledWith("hasSeenIntroSlider", "true");
  });
});
