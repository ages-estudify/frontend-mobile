import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";
import { ActionButton } from "./ActionButton";

describe("ActionButton", () => {
  it("renderiza o texto do botão", () => {
    render(<ActionButton text="Continuar" action={jest.fn()} />);
    expect(screen.getByText("Continuar")).toBeTruthy();
  });

  it("chama action ao pressionar", () => {
    const action = jest.fn();
    render(<ActionButton text="Continuar" action={action} />);
    fireEvent.press(screen.getByText("Continuar"));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("não chama action quando disabled", () => {
    const action = jest.fn();
    render(<ActionButton text="Continuar" action={action} disabled />);
    fireEvent.press(screen.getByText("Continuar"));
    expect(action).not.toHaveBeenCalled();
  });
});
