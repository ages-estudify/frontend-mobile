import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import LoginPage from "../app/login";

const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

const mockLogin = jest.fn();
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
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

  afterEach(() => {
    jest.restoreAllMocks();
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

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Preencha todos os campos");
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("deve chamar o login e redirecionar em caso de sucesso", async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByTestId } = render(<LoginPage />);

    fireEvent.changeText(getByPlaceholderText("email@email.com"), "user@test.com");
    fireEvent.changeText(getByPlaceholderText("*******"), "password123");
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "user@test.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
    });
  });

  it("deve mostrar alerta de erro quando o login falha", async () => {
    const errorMessage = "Verifique os campos preenchidos";
    mockLogin.mockRejectedValueOnce(new Error(errorMessage));

    const { getByPlaceholderText, getByTestId } = render(<LoginPage />);

    fireEvent.changeText(getByPlaceholderText("email@email.com"), "usuario@teste.com");
    fireEvent.changeText(getByPlaceholderText("*******"), "senha123456");
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "usuario@teste.com",
        password: "senha123456",
      });
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erro", errorMessage);
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("deve desabilitar o botão enquanto o carregamento está ativo", async () => {
    mockLogin.mockReturnValueOnce(new Promise(() => {}));

    const { getByPlaceholderText, getByTestId } = render(<LoginPage />);

    fireEvent.changeText(getByPlaceholderText("email@email.com"), "loading@test.com");
    fireEvent.changeText(getByPlaceholderText("*******"), "12345678");
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(getByTestId("login-button").props.accessibilityState.disabled).toBe(true);
    });
  });
});
