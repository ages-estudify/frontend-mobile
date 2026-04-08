import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import LoginPage from "../app/login";

const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

const mockLogin = jest.fn();
jest.mock("@/services/auth.service", () => ({
  authService: {
    login: (...args: any[]) => mockLogin(...args),
  },
}));

jest.mock("../assets/login_fox.png", () => "login_fox.png", { virtual: true });

jest.mock("@/components/ActionButton", () => {
  const { Pressable, Text } = require("react-native");
  const React = require("react");

  return {
    ActionButton: ({ text, action, disabled }: any) => (
      <Pressable
        testID="login-button"
        onPress={action}
        disabled={disabled}
        accessibilityState={{ disabled: !!disabled }}
      >
        <Text>{text}</Text>
      </Pressable>
    ),
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  it("deve renderizar os elementos básicos da tela", () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />);

    expect(getByText("Bem Vindo!")).toBeTruthy();
    expect(getByPlaceholderText("email@email.com")).toBeTruthy();
    expect(getByPlaceholderText("*******")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });

  it("deve mostrar alerta se tentar logar com campos vazios", () => {
    const { getByTestId } = render(<LoginPage />);

    fireEvent.press(getByTestId("login-button"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro",
      "Preencha todos os campos"
    );
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("deve chamar o serviço de login e redirecionar em caso de sucesso", async () => {
    mockLogin.mockResolvedValueOnce({ success: true });

    const { getByPlaceholderText, getByTestId } = render(<LoginPage />);

    fireEvent.changeText(
      getByPlaceholderText("email@email.com"),
      "user@test.com"
    );
    fireEvent.changeText(getByPlaceholderText("*******"), "password123");
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "user@test.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/progress");
    });
  });

  it("deve mostrar alerta de erro quando o login falha", async () => {
    const errorMessage = "Usuário não encontrado";
    mockLogin.mockRejectedValueOnce(errorMessage);

    const { getByPlaceholderText, getByTestId } = render(<LoginPage />);

    fireEvent.changeText(
      getByPlaceholderText("email@email.com"),
      "erro@test.com"
    );
    fireEvent.changeText(getByPlaceholderText("*******"), "123");
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Falha no Login", errorMessage);
    });
  });

  it("deve desabilitar o botão enquanto o carregamento está ativo", async () => {
    mockLogin.mockReturnValueOnce(new Promise(() => {}));

    const { getByPlaceholderText, getByTestId } = render(<LoginPage />);

    fireEvent.changeText(
      getByPlaceholderText("email@email.com"),
      "loading@test.com"
    );
    fireEvent.changeText(getByPlaceholderText("*******"), "123");
    fireEvent.press(getByTestId("login-button"));

    const loginButton = getByTestId("login-button");
    expect(loginButton.props.accessibilityState.disabled).toBe(true);
  });
});
