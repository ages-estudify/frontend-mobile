import { useAuthSession } from "@/contexts/AuthContext";
import { useUserProfileContext } from "@/contexts/UserProfileContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { userPreferencesService } from "@/services/userPreferences/userPreferences.service";
import { saveUserProfile } from "@/services/userProfile/userProfile.storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import EditProfileScreen from "../app/editProfile";

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockReload = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
  }),
}));

jest.mock("@/hooks/useUserProfile");
jest.mock("@/contexts/AuthContext");
jest.mock("@/contexts/UserProfileContext");
jest.mock("@/services/userPreferences/userPreferences.service", () => ({
  userPreferencesService: {
    update: jest.fn(),
  },
}));
jest.mock("@/services/userProfile/userProfile.storage", () => ({
  saveUserProfile: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
  };
});

jest.mock("../assets/User.png", () => "user.png", { virtual: true });

const mockUpdate = userPreferencesService.update as jest.Mock;
const mockSaveUserProfile = saveUserProfile as jest.Mock;

const profileFixture = {
  fullName: "Ana Silva",
  email: "ana@test.com",
  planStatus: "active",
  desiredCourse: "Medicina",
  desiredUniversity: "UFRGS",
  preferredLanguage: "ENGLISH",
  studyHours: {
    MONDAY: [8],
    WEDNESDAY: [14],
  },
};

describe("EditProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});

    (useUserProfile as jest.Mock).mockReturnValue({
      profile: profileFixture,
      loading: false,
      error: null,
      reload: mockReload,
    });
    (useAuthSession as jest.Mock).mockReturnValue({
      role: "USER",
      planExpirationDate: "2099-12-31",
    });
    (useUserProfileContext as jest.Mock).mockReturnValue({
      profilePictureUrl: null,
      updateProfilePicture: jest.fn(),
    });
    mockUpdate.mockResolvedValue(undefined);
    mockSaveUserProfile.mockResolvedValue(undefined);
    mockReload.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza os campos do formulário com dados do perfil", () => {
    render(<EditProfileScreen />);

    expect(screen.getByDisplayValue("Ana Silva")).toBeTruthy();
    expect(screen.getByDisplayValue("ana@test.com")).toBeTruthy();
    expect(screen.getByText("Ativo")).toBeTruthy();
    expect(screen.getByDisplayValue("Medicina")).toBeTruthy();
    expect(screen.getByDisplayValue("UFRGS")).toBeTruthy();
    expect(screen.getByText("Seg")).toBeTruthy();
    expect(screen.getByText("08:00")).toBeTruthy();
  });

  it("mostra loading enquanto o perfil não carregou", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: null,
      loading: true,
      error: null,
      reload: mockReload,
    });

    render(<EditProfileScreen />);

    expect(screen.getByText("Carregando perfil...")).toBeTruthy();
  });

  it("salva preferências e redireciona para o cronograma", async () => {
    render(<EditProfileScreen />);

    fireEvent.press(screen.getByLabelText("Salvar"));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Ana Silva",
          desiredCourse: "Medicina",
          desiredUniversity: "UFRGS",
          preferredLanguage: "ENGLISH",
        })
      );
    });

    expect(mockSaveUserProfile).toHaveBeenCalled();
    expect(mockReload).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/cronograma");
  });

  it("alerta quando a língua informada é inválida", async () => {
    render(<EditProfileScreen />);

    fireEvent.changeText(screen.getByDisplayValue("Inglês"), "Francês");
    fireEvent.press(screen.getByLabelText("Salvar"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erro",
        "A língua estrangeira deve ser Inglês ou Espanhol."
      );
    });

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("mostra erro e permite tentar novamente", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: null,
      loading: false,
      error: "Falha ao carregar perfil",
      reload: mockReload,
    });

    render(<EditProfileScreen />);

    expect(screen.getByText("Falha ao carregar perfil")).toBeTruthy();
    fireEvent.press(screen.getByText("Tentar novamente"));
    expect(mockReload).toHaveBeenCalled();
  });

  it("alterna dias e horários de estudo", () => {
    render(<EditProfileScreen />);

    fireEvent.press(screen.getByText("Ter"));
    fireEvent.press(screen.getByText("Ter"));
    fireEvent.press(screen.getByText("09:00"));
    fireEvent.press(screen.getByText("09:00"));
  });

  it("volta para a tela anterior ao pressionar o botão de voltar", () => {
    render(<EditProfileScreen />);

    fireEvent.press(screen.getByLabelText("Voltar"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("mostra plano inativo quando não há planStatus no perfil", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: { ...profileFixture, planStatus: undefined },
      loading: false,
      error: null,
      reload: mockReload,
    });
    (useAuthSession as jest.Mock).mockReturnValue({
      role: "USER",
      planExpirationDate: null,
    });

    render(<EditProfileScreen />);

    expect(screen.getByText("Inativo")).toBeTruthy();
  });

  it("alerta quando o salvamento falha", async () => {
    mockUpdate.mockRejectedValueOnce(new Error("Erro ao salvar"));

    render(<EditProfileScreen />);
    fireEvent.press(screen.getByLabelText("Salvar"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao salvar");
    });
  });

  it("mostra plano inativo quando planStatus vem como inactive", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: { ...profileFixture, planStatus: "inactive" },
      loading: false,
      error: null,
      reload: mockReload,
    });

    render(<EditProfileScreen />);

    expect(screen.getByText("Inativo")).toBeTruthy();
  });

  it("alerta com mensagem de erro em string ao salvar", async () => {
    mockUpdate.mockRejectedValueOnce("Serviço indisponível");

    render(<EditProfileScreen />);
    fireEvent.press(screen.getByLabelText("Salvar"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erro", "Serviço indisponível");
    });
  });
});
