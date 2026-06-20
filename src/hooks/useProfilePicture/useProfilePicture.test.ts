import type { UpdateProfilePictureResponse } from "@/services/profilePicture/profilePicture.service";
import { profilePictureService } from "@/services/profilePicture/profilePicture.service";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";
import { useProfilePicture } from "./useProfilePicture";

jest.mock("@/services/profilePicture/profilePicture.service", () => ({
  profilePictureService: {
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock("expo-image-picker");

const mockService = profilePictureService as jest.Mocked<typeof profilePictureService>;
const mockPicker = ImagePicker as jest.Mocked<typeof ImagePicker>;

const grantedPermission = {
  status: ImagePicker.PermissionStatus.GRANTED,
  granted: true,
  expires: "never" as const,
  canAskAgain: true,
};

const deniedPermission = {
  status: ImagePicker.PermissionStatus.DENIED,
  granted: false,
  expires: "never" as const,
  canAskAgain: false,
};

const makeAsset = (base64 = "abc123", mimeType = "image/jpeg"): ImagePicker.ImagePickerAsset => ({
  base64,
  mimeType,
  uri: "file://photo.jpg",
  width: 100,
  height: 100,
  assetId: null,
  fileName: "photo.jpg",
  fileSize: 1000,
  exif: null,
  duration: null,
  type: "image",
  pairedVideoAsset: null,
});

describe("useProfilePicture", () => {
  const onSuccess = jest.fn();
  const onRemoveSuccess = jest.fn();
  const onError = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("should call onError when gallery permission is denied", async () => {
    mockPicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce(deniedPermission);

    const { result } = renderHook(() => useProfilePicture({ onSuccess, onError }));

    await act(() => result.current.pickAndUpload());

    expect(onError).toHaveBeenCalledWith("Permissão para acessar a galeria é necessária.");
    expect(mockService.update).not.toHaveBeenCalled();
  });

  it("should do nothing when picker is canceled", async () => {
    mockPicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce(grantedPermission);
    mockPicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: true,
      assets: null,
    });

    const { result } = renderHook(() => useProfilePicture({ onSuccess, onError }));

    await act(() => result.current.pickAndUpload());

    expect(mockService.update).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("should call onSuccess with the returned URL after a successful upload", async () => {
    mockPicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce(grantedPermission);
    mockPicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [makeAsset("abc123", "image/jpeg")],
    });
    mockService.update.mockResolvedValueOnce({
      profilePictureUrl: "https://cdn.example.com/new.jpg",
    });

    const { result } = renderHook(() => useProfilePicture({ onSuccess, onError }));

    await act(() => result.current.pickAndUpload());

    expect(mockService.update).toHaveBeenCalledWith("data:image/jpeg;base64,abc123");
    expect(onSuccess).toHaveBeenCalledWith("https://cdn.example.com/new.jpg");
    expect(onError).not.toHaveBeenCalled();
  });

  it("should call onError with API message on upload failure", async () => {
    mockPicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce(grantedPermission);
    mockPicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [makeAsset("abc123", "image/png")],
    });
    mockService.update.mockRejectedValueOnce(new Error("File too large"));

    const { result } = renderHook(() => useProfilePicture({ onSuccess, onError }));

    await act(() => result.current.pickAndUpload());

    expect(onError).toHaveBeenCalledWith("File too large");
  });

  it("should fall back to generic error message when error has no message", async () => {
    mockPicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce(grantedPermission);
    mockPicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [makeAsset()],
    });
    mockService.update.mockRejectedValueOnce({});

    const { result } = renderHook(() => useProfilePicture({ onSuccess, onError }));

    await act(() => result.current.pickAndUpload());

    expect(onError).toHaveBeenCalledWith("Algo deu errado. Tente novamente.");
  });

  it("should block a second call while upload is in progress", async () => {
    mockPicker.requestMediaLibraryPermissionsAsync.mockResolvedValue(grantedPermission);
    mockPicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [makeAsset()],
    });

    let resolveUpload!: (v: UpdateProfilePictureResponse) => void;
    mockService.update.mockImplementationOnce(
      () =>
        new Promise((res) => {
          resolveUpload = res;
        })
    );

    const { result } = renderHook(() => useProfilePicture({ onSuccess, onError }));

    await act(async () => {
      void result.current.pickAndUpload();
    });

    await waitFor(() => {
      expect(result.current.isUploading).toBe(true);
    });

    await act(async () => {
      await result.current.pickAndUpload();
    });

    expect(mockService.update).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveUpload({ profilePictureUrl: "https://example.com/pic.jpg" });
    });
  });

  it("should call onRemoveSuccess after a successful removal", async () => {
    mockService.remove.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useProfilePicture({ onRemoveSuccess, onError }));

    await act(() => result.current.removePhoto());

    expect(mockService.remove).toHaveBeenCalled();
    expect(onRemoveSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it("should call onError when removal fails", async () => {
    mockService.remove.mockRejectedValueOnce(new Error("Não autorizado"));

    const { result } = renderHook(() => useProfilePicture({ onRemoveSuccess, onError }));

    await act(() => result.current.removePhoto());

    expect(onError).toHaveBeenCalledWith("Não autorizado");
  });

  it("should call onError when selected asset has no base64", async () => {
    mockPicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce(grantedPermission);
    mockPicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ ...makeAsset(), base64: undefined }],
    });

    const { result } = renderHook(() => useProfilePicture({ onSuccess, onError }));

    await act(() => result.current.pickAndUpload());

    expect(onError).toHaveBeenCalledWith("Algo deu errado. Tente novamente.");
    expect(mockService.update).not.toHaveBeenCalled();
  });

  it("should do nothing when picker returns no assets", async () => {
    mockPicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce(grantedPermission);
    mockPicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [],
    });

    const { result } = renderHook(() => useProfilePicture({ onSuccess, onError }));

    await act(() => result.current.pickAndUpload());

    expect(mockService.update).not.toHaveBeenCalled();
  });

  it("should block removePhoto while upload is in progress", async () => {
    mockPicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce(grantedPermission);
    mockPicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [makeAsset()],
    });

    let resolveUpload!: (v: UpdateProfilePictureResponse) => void;
    mockService.update.mockImplementationOnce(
      () =>
        new Promise((res) => {
          resolveUpload = res;
        })
    );

    const { result } = renderHook(() => useProfilePicture({ onRemoveSuccess, onError }));

    await act(async () => {
      void result.current.pickAndUpload();
    });

    await waitFor(() => expect(result.current.isUploading).toBe(true));

    await act(async () => {
      await result.current.removePhoto();
    });

    expect(mockService.remove).not.toHaveBeenCalled();

    await act(async () => {
      resolveUpload({ profilePictureUrl: "https://example.com/pic.jpg" });
    });
  });

  it("should call onError with generic message when removal error has no message", async () => {
    mockService.remove.mockRejectedValueOnce({});

    const { result } = renderHook(() => useProfilePicture({ onRemoveSuccess, onError }));

    await act(() => result.current.removePhoto());

    expect(onError).toHaveBeenCalledWith("Algo deu errado. Tente novamente.");
  });

  it("should expose correct loading flags during removal", async () => {
    let resolveRemove!: () => void;
    mockService.remove.mockImplementationOnce(
      () =>
        new Promise<void>((res) => {
          resolveRemove = res;
        })
    );

    const { result } = renderHook(() => useProfilePicture({}));

    await act(async () => {
      void result.current.removePhoto();
    });

    await waitFor(() => {
      expect(result.current.isRemoving).toBe(true);
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      resolveRemove();
    });

    await waitFor(() => {
      expect(result.current.isRemoving).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should expose correct loading flags during upload", async () => {
    mockPicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce(grantedPermission);
    mockPicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [makeAsset()],
    });

    let resolveUpload!: (v: UpdateProfilePictureResponse) => void;
    mockService.update.mockImplementationOnce(
      () =>
        new Promise<UpdateProfilePictureResponse>((res) => {
          resolveUpload = res;
        })
    );

    const { result } = renderHook(() => useProfilePicture({}));

    await act(async () => {
      void result.current.pickAndUpload();
    });

    await waitFor(() => {
      expect(result.current.isUploading).toBe(true);
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      resolveUpload({ profilePictureUrl: "https://example.com/x.jpg" });
    });

    await waitFor(() => {
      expect(result.current.isUploading).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
