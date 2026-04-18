import { FinishExamModal } from "@/components/FinishExamModal";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

describe("FinishExamModal", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("with blank answers", () => {
    it("should render modal with warning when visible and has blank answers", () => {
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
      expect(screen.getByText("Confirmar")).toBeTruthy();
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
  });

  describe("with all answers responded", () => {
    it("should render modal with review message when all questions answered", () => {
      render(
        <FinishExamModal
          visible={true}
          blankAnswers={0}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Revisar Respostas?")).toBeTruthy();
      expect(screen.getByText(/Você respondeu todas as questões/)).toBeTruthy();
      expect(screen.getByText(/Deseja revisar suas respostas antes de finalizar/)).toBeTruthy();
    });

    it("should show 'Finalizar Agora' button when all answered", () => {
      render(
        <FinishExamModal
          visible={true}
          blankAnswers={0}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Finalizar Agora")).toBeTruthy();
    });

    it("should show 'Revisar' button when all answered", () => {
      render(
        <FinishExamModal
          visible={true}
          blankAnswers={0}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Revisar")).toBeTruthy();
    });

    it("should call onConfirm when review button is pressed", () => {
      render(
        <FinishExamModal
          visible={true}
          blankAnswers={0}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const reviewButton = screen.getByText("Revisar");
      fireEvent.press(reviewButton);

      expect(mockOnConfirm).toHaveBeenCalled();
    });

    it("should call onCancel when finish now button is pressed", () => {
      render(
        <FinishExamModal
          visible={true}
          blankAnswers={0}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const finishButton = screen.getByText("Finalizar Agora");
      fireEvent.press(finishButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe("loading state", () => {
    it("should show loading state with blank answers", () => {
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

    it("should show loading state with all answered", () => {
      render(
        <FinishExamModal
          visible={true}
          blankAnswers={0}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          loading={true}
        />
      );

      expect(screen.getByText("Finalizando...")).toBeTruthy();
    });

    it("should disable buttons when loading with blank answers", () => {
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
      const finishButton = screen.getByText("Finalizando...");

      fireEvent.press(cancelButton);
      fireEvent.press(finishButton);

      expect(mockOnCancel).not.toHaveBeenCalled();
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it("should disable buttons when loading with all answered", () => {
      render(
        <FinishExamModal
          visible={true}
          blankAnswers={0}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          loading={true}
        />
      );

      const finishButton = screen.getByText("Finalizar Agora");
      const reviewButton = screen.getByText("Finalizando...");

      fireEvent.press(finishButton);
      fireEvent.press(reviewButton);

      expect(mockOnCancel).not.toHaveBeenCalled();
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });
});
