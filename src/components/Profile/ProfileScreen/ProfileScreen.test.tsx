import { useAuthSession } from "@/contexts/AuthContext";
import { useUserProfileContext } from "@/contexts/UserProfileContext";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { ProfileScreen } from "./ProfileScreen";

jest.mock("@/hooks/useAuth");
jest.mock("@/hooks/useUserProfile");
jest.mock("@/contexts/AuthContext");
jest.mock("@/contexts/UserProfileContext");
jest.mock("@/components/ProfilePictureEditor/Profilepictureeditor", () => ({
  ProfilePictureEditor: () => {
    const { Text } = require("react-native");
    return <Text testID="profile-picture-editor">Foto</Text>;
  },
}));

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockLogout = jest.fn();
const mockUpdateProfile = jest.fn();
const mockUpdateProfilePicture = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

jest.mock("../../../../assets/profile_background.png", () => "profile_background.png", {
  virtual: true,
});

describe("ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: {
        fullName: "Ana Silva",
        email: "ana@test.com",
        desiredCourse: "Medicina",
        desiredUniversity: "UFRGS",
        preferredLanguage: "ENGLISH",
        studyHours: {
          MONDAY: [8],
          WEDNESDAY: [14],
        },
      },
      updateProfile: mockUpdateProfile,
    });
    (useAuthSession as jest.Mock).mockReturnValue({
      role: "USER",
      planExpirationDate: "2099-12-31",
    });
    (useUserProfileContext as jest.Mock).mockReturnValue({
      profilePictureUrl: "https://cdn.example.com/pic.jpg",
      updateProfilePicture: mockUpdateProfilePicture,
    });
  });

  it("renderiza informações principais do perfil", () => {
    render(<ProfileScreen />);

    expect(screen.getAllByText("Ana Silva").length).toBeGreaterThan(0);
    expect(screen.getByText("ana@test.com")).toBeTruthy();
    expect(screen.getByText("Ativo")).toBeTruthy();
    expect(screen.getByText("Medicina")).toBeTruthy();
    expect(screen.getByText("UFRGS")).toBeTruthy();
    expect(screen.getByText("Inglês")).toBeTruthy();
    expect(screen.getByText("Seg")).toBeTruthy();
    expect(screen.getByText("Quar")).toBeTruthy();
    expect(screen.getByText("08:00")).toBeTruthy();
    expect(screen.getByText("14:00")).toBeTruthy();
    expect(screen.getByTestId("profile-picture-editor")).toBeTruthy();
  });

  it("navega para editar perfil e gerenciar planos", () => {
    render(<ProfileScreen />);

    fireEvent.press(screen.getByLabelText("Editar perfil"));
    expect(mockPush).toHaveBeenCalledWith("/onboarding?mode=edit");

    fireEvent.press(screen.getByText("Gerenciar Planos"));
    expect(mockPush).toHaveBeenCalledWith("/plans");
  });

  it("executa logout ao sair da conta", () => {
    render(<ProfileScreen />);

    fireEvent.press(screen.getByText("Sair da conta"));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("mostra fallback quando o perfil está vazio", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: null,
      updateProfile: mockUpdateProfile,
    });
    (useAuthSession as jest.Mock).mockReturnValue({
      role: "USER",
      planExpirationDate: null,
    });

    render(<ProfileScreen />);

    expect(screen.getByText("Usuário")).toBeTruthy();
    expect(screen.getByText("Inativo")).toBeTruthy();
    expect(screen.getByText("Nenhum dia de estudo configurado.")).toBeTruthy();
    expect(screen.getByText("Nenhum horário de estudo configurado.")).toBeTruthy();
  });
});
