import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { RetryConfirmModal } from "./RetryConfirmModal";

describe("RetryConfirmModal", () => {
  it("renderiza título e descrição quando visível", () => {
    render(<RetryConfirmModal visible onConfirm={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText("Tentativa em andamento")).toBeTruthy();
    expect(screen.getByText("Sim, iniciar nova tentativa")).toBeTruthy();
    expect(screen.getByText("Cancelar")).toBeTruthy();
  });

  it("chama onConfirm ao pressionar o botão de confirmação", () => {
    const onConfirm = jest.fn();
    render(<RetryConfirmModal visible onConfirm={onConfirm} onCancel={jest.fn()} />);
    fireEvent.press(screen.getByText("Sim, iniciar nova tentativa"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("chama onCancel ao pressionar Cancelar", () => {
    const onCancel = jest.fn();
    render(<RetryConfirmModal visible onConfirm={jest.fn()} onCancel={onCancel} />);
    fireEvent.press(screen.getByText("Cancelar"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("não renderiza o conteúdo quando visible é false", () => {
    render(<RetryConfirmModal visible={false} onConfirm={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.queryByText("Tentativa em andamento")).toBeNull();
  });
});
