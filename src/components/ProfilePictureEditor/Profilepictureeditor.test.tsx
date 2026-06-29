jest.mock("../../../assets/placeholder_user.png", () => 1);

jest.mock("@/hooks/useProfilePicture/useProfilePicture", () => ({
  useProfilePicture: jest.fn(),
}));

import { act, fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Alert, Platform } from "react-native";
import { useProfilePicture } from "@/hooks/useProfilePicture/useProfilePicture";
import { ProfilePictureEditor } from "./Profilepictureeditor";

const mockUseProfilePicture = useProfilePicture as jest.Mock;

type HookOptions = Parameters<typeof useProfilePicture>[0];

const makeHookValue = (overrides = {}) => ({
  pickAndUpload: jest.fn(),
  removePhoto: jest.fn(),
  isUploading: false,
  isRemoving: false,
  isLoading: false,
  ...overrides,
});

const mockHookCapturingOptions = (overrides = {}) => {
  let captured: HookOptions;
  mockUseProfilePicture.mockImplementation((options: HookOptions) => {
    captured = options;
    return makeHookValue(overrides);
  });
  return () => captured as HookOptions;
};

const ORIGINAL_OS = Platform.OS;

describe("ProfilePictureEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProfilePicture.mockReturnValue(makeHookValue());
  });

  afterEach(() => {
    Platform.OS = ORIGINAL_OS;
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

  describe("plataforma nativa", () => {
    beforeEach(() => {
      Platform.OS = "ios";
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

    it("não inclui a opção 'Remover foto' quando não há currentUrl", () => {
      const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

      render(<ProfilePictureEditor />);
      fireEvent.press(screen.getByRole("button", { name: "Editar foto de perfil" }));

      const buttons = alertSpy.mock.calls[0][2] as { text: string }[];
      const labels = buttons.map((b) => b.text);
      expect(labels).toEqual(["Escolher foto", "Cancelar"]);

      alertSpy.mockRestore();
    });

    it("aciona pickAndUpload ao escolher 'Escolher foto' no Alert", () => {
      const pickAndUpload = jest.fn();
      mockUseProfilePicture.mockReturnValue(makeHookValue({ pickAndUpload }));
      const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

      render(<ProfilePictureEditor />);
      fireEvent.press(screen.getByRole("button", { name: "Editar foto de perfil" }));

      const buttons = alertSpy.mock.calls[0][2] as { text: string; onPress?: () => void }[];
      const escolher = buttons.find((b) => b.text === "Escolher foto");
      act(() => escolher?.onPress?.());

      expect(pickAndUpload).toHaveBeenCalledTimes(1);

      alertSpy.mockRestore();
    });

    it("inclui 'Remover foto' e confirma a remoção via segundo Alert", () => {
      const removePhoto = jest.fn();
      mockUseProfilePicture.mockReturnValue(makeHookValue({ removePhoto }));
      const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

      render(<ProfilePictureEditor currentUrl="https://cdn.example.com/avatar.jpg" />);
      fireEvent.press(screen.getByRole("button", { name: "Editar foto de perfil" }));

      // Primeiro Alert: aciona a opção destrutiva "Remover foto"
      const firstButtons = alertSpy.mock.calls[0][2] as {
        text: string;
        onPress?: () => void;
      }[];
      const remover = firstButtons.find((b) => b.text === "Remover foto");
      expect(remover).toBeDefined();
      act(() => remover?.onPress?.());

      // Segundo Alert: confirmação
      expect(alertSpy).toHaveBeenCalledWith(
        "Remover foto",
        "Tem certeza que deseja remover sua foto de perfil?",
        expect.any(Array)
      );
      const confirmButtons = alertSpy.mock.calls[1][2] as {
        text: string;
        onPress?: () => void;
      }[];
      const confirmar = confirmButtons.find((b) => b.text === "Remover");
      act(() => confirmar?.onPress?.());

      expect(removePhoto).toHaveBeenCalledTimes(1);

      alertSpy.mockRestore();
    });
  });

  describe("plataforma web", () => {
    beforeEach(() => {
      Platform.OS = "web";
    });

    it("alterna o menu de opções ao pressionar o avatar", () => {
      render(<ProfilePictureEditor />);
      const avatar = screen.getByRole("button", { name: "Editar foto de perfil" });

      expect(screen.queryByText("Escolher foto")).toBeNull();

      fireEvent.press(avatar);
      expect(screen.getByText("Escolher foto")).toBeTruthy();

      fireEvent.press(avatar);
      expect(screen.queryByText("Escolher foto")).toBeNull();
    });

    it("não mostra 'Remover foto' no menu sem currentUrl", () => {
      render(<ProfilePictureEditor />);
      fireEvent.press(screen.getByRole("button", { name: "Editar foto de perfil" }));

      expect(screen.getByText("Escolher foto")).toBeTruthy();
      expect(screen.queryByText("Remover foto")).toBeNull();
    });

    it("mostra 'Remover foto' no menu quando há currentUrl", () => {
      render(<ProfilePictureEditor currentUrl="https://cdn.example.com/avatar.jpg" />);
      fireEvent.press(screen.getByRole("button", { name: "Editar foto de perfil" }));

      expect(screen.getByText("Remover foto")).toBeTruthy();
    });

    it("aciona pickAndUpload ao pressionar 'Escolher foto' no menu", () => {
      const pickAndUpload = jest.fn();
      mockUseProfilePicture.mockReturnValue(makeHookValue({ pickAndUpload }));

      render(<ProfilePictureEditor />);
      fireEvent.press(screen.getByRole("button", { name: "Editar foto de perfil" }));
      fireEvent.press(screen.getByText("Escolher foto"));

      expect(pickAndUpload).toHaveBeenCalledTimes(1);
    });

    it("aciona removePhoto diretamente ao pressionar 'Remover foto' no menu", () => {
      const removePhoto = jest.fn();
      mockUseProfilePicture.mockReturnValue(makeHookValue({ removePhoto }));

      render(<ProfilePictureEditor currentUrl="https://cdn.example.com/avatar.jpg" />);
      fireEvent.press(screen.getByRole("button", { name: "Editar foto de perfil" }));
      fireEvent.press(screen.getByText("Remover foto"));

      expect(removePhoto).toHaveBeenCalledTimes(1);
    });
  });

  describe("callbacks do hook", () => {
    it("fecha o menu e chama onUpdate no onSuccess", () => {
      Platform.OS = "web";
      const onUpdate = jest.fn();
      const getOptions = mockHookCapturingOptions();

      render(<ProfilePictureEditor onUpdate={onUpdate} />);
      // abre o menu para validar que ele fecha após o sucesso
      fireEvent.press(screen.getByRole("button", { name: "Editar foto de perfil" }));
      expect(screen.getByText("Escolher foto")).toBeTruthy();

      act(() => getOptions().onSuccess?.("https://cdn.example.com/new.jpg"));

      expect(onUpdate).toHaveBeenCalledWith("https://cdn.example.com/new.jpg");
      expect(screen.queryByText("Escolher foto")).toBeNull();
    });

    it("não quebra no onSuccess quando onUpdate não é fornecido", () => {
      const getOptions = mockHookCapturingOptions();

      render(<ProfilePictureEditor />);

      expect(() =>
        act(() => getOptions().onSuccess?.("https://cdn.example.com/new.jpg"))
      ).not.toThrow();
    });

    it("fecha o menu e chama onRemove no onRemoveSuccess", () => {
      Platform.OS = "web";
      const onRemove = jest.fn();
      const getOptions = mockHookCapturingOptions();

      render(
        <ProfilePictureEditor currentUrl="https://cdn.example.com/avatar.jpg" onRemove={onRemove} />
      );
      fireEvent.press(screen.getByRole("button", { name: "Editar foto de perfil" }));
      expect(screen.getByText("Remover foto")).toBeTruthy();

      act(() => getOptions().onRemoveSuccess?.());

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("Escolher foto")).toBeNull();
    });

    it("exibe Alert de erro no onError", () => {
      const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());
      const getOptions = mockHookCapturingOptions();

      render(<ProfilePictureEditor />);
      act(() => getOptions().onError?.("Falha ao enviar"));

      expect(alertSpy).toHaveBeenCalledWith("Erro", "Falha ao enviar");

      alertSpy.mockRestore();
    });
  });
});
