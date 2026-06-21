import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import RegisterScreen from "../app/register";

const mockReplace = jest.fn();
const mockBack = jest.fn();
jest.mock("expo-router", () => ({
  router: {
    replace: (...args: unknown[]) => mockReplace(...args),
    back: mockBack,
  },
}));

const mockRegister = jest.fn();
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
  };
});

jest.mock("@/components/TextInputWithTitle/TextInputWithTitle", () => {
  const { TextInput, View, Text } = require("react-native");
  const React = require("react");

  return {
    TextInputWithTitle: ({
      title,
      placeholder,
      text,
      onValueChange,
      errorMessage,
      isPassword,
      keyboardType,
      autoCapitalize,
      maxLength,
    }: any) => (
      <View>
        <Text>{title}</Text>
        <TextInput
          testID={`input-${title}`}
          placeholder={placeholder}
          value={text}
          onChangeText={onValueChange}
          secureTextEntry={isPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
        />
        {errorMessage && <Text testID={`error-${title}`}>{errorMessage}</Text>}
      </View>
    ),
  };
});

describe("RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve renderizar os elementos básicos da tela", () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    expect(getByText("Cadastro")).toBeTruthy();
    expect(getByPlaceholderText("Ex: Maria dos Santos")).toBeTruthy();
    expect(getByPlaceholderText("abc@abc.com")).toBeTruthy();
    expect(getByPlaceholderText("DD/MM/AAAA")).toBeTruthy();
    expect(getByPlaceholderText("(11) 99999-9999")).toBeTruthy();
    expect(getByText("Confirmar")).toBeTruthy();
  });

  it("deve mostrar alerta se tentar registrar com campos vazios", () => {
    const { getByText } = render(<RegisterScreen />);

    fireEvent.press(getByText("Confirmar"));

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Preencha todos os campos");
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("deve mostrar alerta se o email for inválido", () => {
    render(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Ex: Maria dos Santos"), "Maria Silva");
    fireEvent.changeText(screen.getByPlaceholderText("abc@abc.com"), "email_invalido");
    fireEvent.changeText(screen.getByPlaceholderText("DD/MM/AAAA"), "01/01/1990");
    fireEvent.changeText(screen.getByPlaceholderText("(11) 99999-9999"), "11999999999");
    fireEvent.changeText(screen.getByTestId("input-Senha"), "password123");
    fireEvent.changeText(screen.getByTestId("input-Confirmar Senha"), "password123");

    fireEvent.press(screen.getByText("Confirmar"));

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Email inválido");
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("deve mostrar alerta se a senha tiver menos de 8 caracteres", () => {
    render(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Ex: Maria dos Santos"), "Maria Silva");
    fireEvent.changeText(screen.getByPlaceholderText("abc@abc.com"), "maria@email.com");
    fireEvent.changeText(screen.getByPlaceholderText("DD/MM/AAAA"), "01/01/1990");
    fireEvent.changeText(screen.getByPlaceholderText("(11) 99999-9999"), "11999999999");
    fireEvent.changeText(screen.getByTestId("input-Senha"), "123");
    fireEvent.changeText(screen.getByTestId("input-Confirmar Senha"), "123");

    fireEvent.press(screen.getByText("Confirmar"));

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "A senha deve ter no mínimo 8 caracteres");
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("deve mostrar alerta se as senhas não conferem", () => {
    render(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Ex: Maria dos Santos"), "Maria Silva");
    fireEvent.changeText(screen.getByPlaceholderText("abc@abc.com"), "maria@email.com");
    fireEvent.changeText(screen.getByPlaceholderText("DD/MM/AAAA"), "01/01/1990");
    fireEvent.changeText(screen.getByPlaceholderText("(11) 99999-9999"), "11999999999");
    fireEvent.changeText(screen.getByTestId("input-Senha"), "password123");
    fireEvent.changeText(screen.getByTestId("input-Confirmar Senha"), "differentpassword");

    fireEvent.press(screen.getByText("Confirmar"));

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "As senhas não conferem");
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("deve mostrar alerta se a data de nascimento for inválida", () => {
    render(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Ex: Maria dos Santos"), "Maria Silva");
    fireEvent.changeText(screen.getByPlaceholderText("abc@abc.com"), "maria@email.com");
    fireEvent.changeText(screen.getByPlaceholderText("DD/MM/AAAA"), "32/13/1990");
    fireEvent.changeText(screen.getByPlaceholderText("(11) 99999-9999"), "11999999999");
    fireEvent.changeText(screen.getByTestId("input-Senha"), "password123");
    fireEvent.changeText(screen.getByTestId("input-Confirmar Senha"), "password123");

    fireEvent.press(screen.getByText("Confirmar"));

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Data de nascimento inválida");
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("deve mostrar alerta se o telefone for inválido", () => {
    render(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Ex: Maria dos Santos"), "Maria Silva");
    fireEvent.changeText(screen.getByPlaceholderText("abc@abc.com"), "maria@email.com");
    fireEvent.changeText(screen.getByPlaceholderText("DD/MM/AAAA"), "01/01/1990");
    fireEvent.changeText(screen.getByPlaceholderText("(11) 99999-9999"), "123");
    fireEvent.changeText(screen.getByTestId("input-Senha"), "password123");
    fireEvent.changeText(screen.getByTestId("input-Confirmar Senha"), "password123");

    fireEvent.press(screen.getByText("Confirmar"));

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Número de telefone inválido");
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("deve chamar register e redirecionar em caso de sucesso", async () => {
    mockRegister.mockResolvedValueOnce(undefined);

    render(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Ex: Maria dos Santos"), "Maria Silva");
    fireEvent.changeText(screen.getByPlaceholderText("abc@abc.com"), "maria@email.com");
    fireEvent.changeText(screen.getByPlaceholderText("DD/MM/AAAA"), "01/01/1990");
    fireEvent.changeText(screen.getByPlaceholderText("(11) 99999-9999"), "11999999999");
    fireEvent.changeText(screen.getByTestId("input-Senha"), "password123");
    fireEvent.changeText(screen.getByTestId("input-Confirmar Senha"), "password123");

    fireEvent.press(screen.getByText("Confirmar"));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        fullName: "Maria Silva",
        email: "maria@email.com",
        password: "password123",
        phone: "11999999999",
        birthDate: "1990-01-01",
      });
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/onboarding");
    });
  });

  it("deve mostrar alerta de erro quando o registro falha", async () => {
    const errorMessage = "Email já cadastrado";
    mockRegister.mockRejectedValueOnce(new Error(errorMessage));

    render(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Ex: Maria dos Santos"), "Maria Silva");
    fireEvent.changeText(screen.getByPlaceholderText("abc@abc.com"), "maria@email.com");
    fireEvent.changeText(screen.getByPlaceholderText("DD/MM/AAAA"), "01/01/1990");
    fireEvent.changeText(screen.getByPlaceholderText("(11) 99999-9999"), "11999999999");
    fireEvent.changeText(screen.getByTestId("input-Senha"), "password123");
    fireEvent.changeText(screen.getByTestId("input-Confirmar Senha"), "password123");

    fireEvent.press(screen.getByText("Confirmar"));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });

    expect(mockReplace).not.toHaveBeenCalled();

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao realizar cadastro. Tente novamente.");
  });

  it("deve validar telefone com 10 e 11 dígitos", () => {
    render(<RegisterScreen />);

    // Testando com 10 dígitos
    fireEvent.changeText(screen.getByPlaceholderText("Ex: Maria dos Santos"), "Maria Silva");
    fireEvent.changeText(screen.getByPlaceholderText("abc@abc.com"), "maria@email.com");
    fireEvent.changeText(screen.getByPlaceholderText("DD/MM/AAAA"), "01/01/1990");
    fireEvent.changeText(screen.getByPlaceholderText("(11) 99999-9999"), "1199999999");
    fireEvent.changeText(screen.getByTestId("input-Senha"), "password123");
    fireEvent.changeText(screen.getByTestId("input-Confirmar Senha"), "password123");

    fireEvent.press(screen.getByText("Confirmar"));

    // A validação deve passar e chamar o register
    expect(mockRegister).toHaveBeenCalled();
  });

  it("deve formatar data corretamente", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);

    const dateInput = getByPlaceholderText("DD/MM/AAAA");
    fireEvent.changeText(dateInput, "01011990");

    // A data deve estar formatada como DD/MM/AAAA
    expect(dateInput.props.value).toBe("01/01/1990");
  });

  it("deve formatar telefone corretamente", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);

    const phoneInput = getByPlaceholderText("(11) 99999-9999");
    fireEvent.changeText(phoneInput, "11999999999");

    // O telefone deve estar formatado como (11) 99999-9999
    expect(phoneInput.props.value).toMatch(/\(\d{2}\) \d{5}-\d{4}/);
  });
});
