import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";
import { EmptySimuladosState } from "./EmptySimuladosState";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
}));

describe("EmptySimuladosState", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renderiza os textos do estado vazio", () => {
    render(<EmptySimuladosState />);
    expect(screen.getByText("Você ainda não tem simulados")).toBeTruthy();
    expect(screen.getByText("Comece um novo simulado e alcance sua aprovação")).toBeTruthy();
  });

  it("renderiza o botão de começar simulado", () => {
    render(<EmptySimuladosState />);
    expect(screen.getByText("Começar Simulado")).toBeTruthy();
  });

  it("navega para a tela de simulado ao pressionar o botão", () => {
    render(<EmptySimuladosState />);
    fireEvent.press(screen.getByText("Começar Simulado"));
    expect(mockPush).toHaveBeenCalledWith("/(tabs)/simulado");
  });
});
