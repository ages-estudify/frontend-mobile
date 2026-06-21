jest.mock("../../../assets/placeholder_user.png", () => 1);

jest.mock("@/hooks/useProfilePicture/useProfilePicture", () => ({
  useProfilePicture: jest.fn(),
}));

import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import { useProfilePicture } from "@/hooks/useProfilePicture/useProfilePicture";
import { ProfilePictureEditor } from "./Profilepictureeditor";

const mockUseProfilePicture = useProfilePicture as jest.Mock;

const makeHookValue = (overrides = {}) => ({
  pickAndUpload: jest.fn(),
  removePhoto: jest.fn(),
  isUploading: false,
  isRemoving: false,
  isLoading: false,
  ...overrides,
});

describe("ProfilePictureEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProfilePicture.mockReturnValue(makeHookValue());
  });

  it("renderiza sem quebrar sem URL (placeholder)", () => {
    const { toJSON } = render(<ProfilePictureEditor />);
    expect(toJSON()).toBeTruthy();
  });

  it("renderiza sem quebrar com URL de imagem fornecida", () => {
    const { toJSON } = render(
      <ProfilePictureEditor currentUrl="https://cdn.example.com/avatar.jpg" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it("exibe texto de envio enquanto está fazendo upload", () => {
    mockUseProfilePicture.mockReturnValue(makeHookValue({ isUploading: true, isLoading: true }));

    render(<ProfilePictureEditor />);

    expect(screen.getByText("Enviando foto...")).toBeTruthy();
  });

  it("exibe texto de remoção enquanto está removendo a foto", () => {
    mockUseProfilePicture.mockReturnValue(makeHookValue({ isRemoving: true, isLoading: true }));

    render(<ProfilePictureEditor />);

    expect(screen.getByText("Removendo foto...")).toBeTruthy();
  });

  it("não exibe textos de carregamento quando está ocioso", () => {
    render(<ProfilePictureEditor />);

    expect(screen.queryByText("Enviando foto...")).toBeNull();
    expect(screen.queryByText("Removendo foto...")).toBeNull();
  });

  it("abre Alert ao pressionar o avatar quando não está carregando", () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

    render(<ProfilePictureEditor />);
    fireEvent.press(screen.getByRole("button", { name: "Editar foto de perfil" }));

    expect(alertSpy).toHaveBeenCalledWith(
      "Foto de perfil",
      "O que você deseja fazer?",
      expect.any(Array)
    );

    alertSpy.mockRestore();
  });

  it("não abre Alert quando está em estado de carregamento", () => {
    mockUseProfilePicture.mockReturnValue(makeHookValue({ isLoading: true, isUploading: true }));
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

    render(<ProfilePictureEditor />);
    fireEvent.press(screen.getByRole("button", { name: "Editar foto de perfil" }));

    expect(alertSpy).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
