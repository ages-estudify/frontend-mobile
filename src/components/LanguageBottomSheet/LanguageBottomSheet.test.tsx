import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { LanguageBottomSheet } from "./LanguageBottomSheet";

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ children }: any) => <View>{children}</View>,
    BottomSheetModal: ({ children }: any) => <View>{children}</View>,
    BottomSheetScrollView: ({ children }: any) => <View>{children}</View>,
    BottomSheetBackdrop: () => null,
  };
});

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
}));

describe("LanguageBottomSheet", () => {
  const defaultProps = {
    visible: true,
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  it("renderiza título e opções de idioma", () => {
    render(<LanguageBottomSheet {...defaultProps} />);
    expect(screen.getByText("Escolha o idioma")).toBeTruthy();
    expect(screen.getByText("Inglês")).toBeTruthy();
    expect(screen.getByText("Espanhol")).toBeTruthy();
  });

  it("não chama onConfirm quando nenhum idioma está selecionado", () => {
    const onConfirm = jest.fn();
    render(<LanguageBottomSheet {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.press(screen.getByText("Começar Simulado"));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("chama onConfirm com idioma selecionado", () => {
    const onConfirm = jest.fn();
    render(<LanguageBottomSheet {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.press(screen.getByText("Inglês"));
    fireEvent.press(screen.getByText("Começar Simulado"));
    expect(onConfirm).toHaveBeenCalledWith("ENGLISH");
  });

  it("chama onConfirm com SPANISH ao selecionar Espanhol", () => {
    const onConfirm = jest.fn();
    render(<LanguageBottomSheet {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.press(screen.getByText("Espanhol"));
    fireEvent.press(screen.getByText("Começar Simulado"));
    expect(onConfirm).toHaveBeenCalledWith("SPANISH");
  });
});
