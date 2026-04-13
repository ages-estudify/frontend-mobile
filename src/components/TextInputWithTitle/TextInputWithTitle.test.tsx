import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { TextInputWithTitle } from "./TextInputWithTitle";

describe("TextInputWithTitle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza título e placeholder corretamente", () => {
    const onValueChange = jest.fn();

    const { getByText, getByPlaceholderText } = render(
      <TextInputWithTitle
        title="Email"
        placeholder="email@email.com"
        text=""
        onValueChange={onValueChange}
      />
    );

    expect(getByText("Email")).toBeTruthy();
    expect(getByPlaceholderText("email@email.com")).toBeTruthy();
  });

  it("chama onValueChange ao digitar", () => {
    const onValueChange = jest.fn();

    const { getByPlaceholderText } = render(
      <TextInputWithTitle
        title="Email"
        placeholder="email@email.com"
        text=""
        onValueChange={onValueChange}
      />
    );

    fireEvent.changeText(getByPlaceholderText("email@email.com"), "novo@email.com");

    expect(onValueChange).toHaveBeenCalledWith("novo@email.com");
  });

  it('renderiza "Esqueceu sua senha?" quando isPassword for true', () => {
    const onValueChange = jest.fn();

    const { getByText } = render(
      <TextInputWithTitle
        title="Senha"
        placeholder="*******"
        isPassword
        text=""
        onValueChange={onValueChange}
      />
    );

    expect(getByText("Esqueceu sua senha?")).toBeTruthy();
  });

  it('não renderiza "Esqueceu sua senha?" quando isPassword for false', () => {
    const onValueChange = jest.fn();

    const { queryByText } = render(
      <TextInputWithTitle
        title="Email"
        placeholder="email@email.com"
        text=""
        onValueChange={onValueChange}
      />
    );

    expect(queryByText("Esqueceu sua senha?")).toBeNull();
  });

  it("começa com secureTextEntry ativo quando for senha", () => {
    const onValueChange = jest.fn();

    const { getByPlaceholderText } = render(
      <TextInputWithTitle
        title="Senha"
        placeholder="*******"
        isPassword
        text="123456"
        onValueChange={onValueChange}
      />
    );

    expect(getByPlaceholderText("*******").props.secureTextEntry).toBe(true);
  });

  it("alterna secureTextEntry ao clicar no botão do olho", () => {
    const onValueChange = jest.fn();

    const { getByPlaceholderText, getByTestId } = render(
      <TextInputWithTitle
        title="Senha"
        placeholder="*******"
        isPassword
        text="123456"
        onValueChange={onValueChange}
      />
    );

    expect(getByPlaceholderText("*******").props.secureTextEntry).toBe(true);

    fireEvent.press(getByTestId("toggle-password-visibility"));

    expect(getByPlaceholderText("*******").props.secureTextEntry).toBe(false);

    fireEvent.press(getByTestId("toggle-password-visibility"));

    expect(getByPlaceholderText("*******").props.secureTextEntry).toBe(true);
  });
});
