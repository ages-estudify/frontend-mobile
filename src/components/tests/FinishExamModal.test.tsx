import { FinishExamModal } from "@/components/FinishExamModal";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

describe("FinishExamModal", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render modal when visible is true", () => {
    render(
      <FinishExamModal
        visible={true}
        blankAnswers={5}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Finalizar Simulado?")).toBeTruthy();
    expect(screen.getByText("Cancelar")).toBeTruthy();
  });

  it("should not render modal when visible is false", () => {
    render(
      <FinishExamModal
        visible={false}
        blankAnswers={5}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText("Finalizar Simulado?")).toBeNull();
  });

  it("should call onCancel when cancel button is pressed", () => {
    render(
      <FinishExamModal
        visible={true}
        blankAnswers={5}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.press(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("should call onConfirm when confirm button is pressed", () => {
    render(
      <FinishExamModal
        visible={true}
        blankAnswers={5}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByText("Confirmar");
    fireEvent.press(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it("should show loading state", () => {
    render(
      <FinishExamModal
        visible={true}
        blankAnswers={5}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    expect(screen.getByText("Finalizando...")).toBeTruthy();
  });

  it("should disable buttons when loading", () => {
    render(
      <FinishExamModal
        visible={true}
        blankAnswers={5}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    const cancelButton = screen.getByText("Cancelar");
    const confirmButton = screen.getByText("Finalizando...");

    fireEvent.press(cancelButton);
    fireEvent.press(confirmButton);

    expect(mockOnCancel).not.toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("should display singular form for 1 blank answer", () => {
    render(
      <FinishExamModal
        visible={true}
        blankAnswers={1}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Finalizar Simulado?")).toBeTruthy();
    expect(screen.getByText("Cancelar")).toBeTruthy();
  });

  it("should display plural form for multiple blank answers", () => {
    render(
      <FinishExamModal
        visible={true}
        blankAnswers={10}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Finalizar Simulado?")).toBeTruthy();
    expect(screen.getByText("Confirmar")).toBeTruthy();
  });

  it("should display 0 blank answers", () => {
    render(
      <FinishExamModal
        visible={true}
        blankAnswers={0}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Revisar Respostas?")).toBeTruthy();
    expect(screen.getByText("Revisar")).toBeTruthy();
  });
});
