import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";
import { ExamCardMenu } from "./ExamCardMenu";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
}));

jest.mock("expo-blur", () => {
  const { View } = require("react-native");
  return { BlurView: (props: Record<string, unknown>) => <View {...props} /> };
});

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  onHistory: jest.fn(),
  onRetry: jest.fn(),
  anchorRect: { x: 100, y: 200, width: 177, height: 218 },
};

describe("ExamCardMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza as opções quando visível", () => {
    render(<ExamCardMenu {...defaultProps} />);
    expect(screen.getByText("Histórico Tentativas")).toBeTruthy();
    expect(screen.getByText("Tentar Novamente")).toBeTruthy();
  });

  it("não renderiza as opções quando não visível", () => {
    render(<ExamCardMenu {...defaultProps} visible={false} />);
    expect(screen.queryByText("Histórico Tentativas")).toBeNull();
    expect(screen.queryByText("Tentar Novamente")).toBeNull();
  });

  it("chama onHistory ao pressionar Histórico Tentativas", () => {
    const onHistory = jest.fn();
    const onClose = jest.fn();
    render(<ExamCardMenu {...defaultProps} onHistory={onHistory} onClose={onClose} />);
    fireEvent.press(screen.getByText("Histórico Tentativas"));
    expect(onClose).toHaveBeenCalled();
    expect(onHistory).toHaveBeenCalled();
  });

  it("chama onRetry ao pressionar Tentar Novamente", () => {
    const onRetry = jest.fn();
    const onClose = jest.fn();
    render(<ExamCardMenu {...defaultProps} onRetry={onRetry} onClose={onClose} />);
    fireEvent.press(screen.getByText("Tentar Novamente"));
    expect(onClose).toHaveBeenCalled();
    expect(onRetry).toHaveBeenCalled();
  });
});
