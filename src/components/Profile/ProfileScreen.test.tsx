import { useAuthSession } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { ProfileScreen } from "./ProfileScreen";

jest.mock("@/hooks/useAuth");
jest.mock("@/hooks/useUserProfile");
jest.mock("@/contexts/AuthContext");

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockLogout = jest.fn();
const mockReload = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, top: 44, left: 0, right: 0 }),
}));

jest.mock("../../../assets/profile_background.png", () => "profile_background.png", {
  virtual: true,
});

jest.mock("../../../assets/User.png", () => "user.png", { virtual: true });

describe("ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: {
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
      },
      loading: false,
      error: null,
      reload: mockReload,
    });
    (useAuthSession as jest.Mock).mockReturnValue({
      role: "USER",
      planExpirationDate: "2099-12-31",
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
  });

  it("navega para editar perfil e gerenciar planos", () => {
    render(<ProfileScreen />);

    fireEvent.press(screen.getByLabelText("Editar perfil"));
    expect(mockPush).toHaveBeenCalledWith("/editProfile");

    fireEvent.press(screen.getByText("Gerenciar Planos"));
    expect(mockPush).toHaveBeenCalledWith("/plans");
  });

  it("executa logout ao sair da conta", () => {
    render(<ProfileScreen />);

    fireEvent.press(screen.getByText("Sair da conta"));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("mostra estado de loading quando o perfil ainda não carregou", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: null,
      loading: true,
      error: null,
      reload: mockReload,
    });

    render(<ProfileScreen />);

    expect(screen.getByText("Carregando perfil...")).toBeTruthy();
  });

  it("mostra erro com retry quando falha ao carregar", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: null,
      loading: false,
      error: "Falha na rede",
      reload: mockReload,
    });

    render(<ProfileScreen />);

    expect(screen.getByText("Falha na rede")).toBeTruthy();
    fireEvent.press(screen.getByText("Tentar novamente"));
    expect(mockReload).toHaveBeenCalled();
  });

  it("mostra fallback quando o perfil está vazio", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: null,
      loading: false,
      error: null,
      reload: mockReload,
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

  it("mostra aviso de erro quando o perfil já foi carregado", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: {
        fullName: "Ana Silva",
        email: "ana@test.com",
        planStatus: "inactive",
      },
      loading: false,
      error: "Não foi possível atualizar",
      reload: mockReload,
    });

    render(<ProfileScreen />);

    expect(screen.getByText("Não foi possível atualizar")).toBeTruthy();
    expect(screen.getByText("Inativo")).toBeTruthy();
  });

  it("usa planStatus inativo vindo da API", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: {
        fullName: "Ana Silva",
        email: "ana@test.com",
        planStatus: "inactive",
      },
      loading: false,
      error: null,
      reload: mockReload,
    });

    render(<ProfileScreen />);

    expect(screen.getByText("Inativo")).toBeTruthy();
  });

  it("volta para a tela anterior ao pressionar o botão voltar", () => {
    render(<ProfileScreen />);

    fireEvent.press(screen.getByLabelText("Voltar"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("usa plano ativo pelo acesso quando planStatus não vem da API", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: {
        fullName: "Ana Silva",
        email: "ana@test.com",
      },
      loading: false,
      error: null,
      reload: mockReload,
    });
    (useAuthSession as jest.Mock).mockReturnValue({
      role: "USER",
      planExpirationDate: "2099-12-31",
    });

    render(<ProfileScreen />);

    expect(screen.getByText("Ativo")).toBeTruthy();
  });

  it("mostra placeholders quando campos do perfil estão vazios", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: {
        fullName: "",
        email: "",
        planStatus: "active",
      },
      loading: false,
      error: null,
      reload: mockReload,
    });

    render(<ProfileScreen />);

    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
    expect(screen.getByText("Usuário")).toBeTruthy();
  });
});
