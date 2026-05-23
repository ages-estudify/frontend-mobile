import { SequenceBadge } from "@/components/SequenceBadge";
import { render, screen } from "@testing-library/react-native";
import React from "react";

jest.mock("../../../assets/icons/fire.svg", () => ({
  __esModule: true,
  default: () => null,
}));

describe("SequenceBadge", () => {
  it("renderiza contador corretamente quando o streak está ativo", () => {
    render(<SequenceBadge sequence={7} streakActive={true} isLoading={false} hasError={false} />);

    expect(screen.getByText("Sequencia de Dias: 7")).toBeTruthy();
    expect(screen.getByText("Seu streak está ativo.")).toBeTruthy();
  });

  it("renderiza estado quebrado quando streakDays é 0", () => {
    render(<SequenceBadge sequence={0} streakActive={false} isLoading={false} hasError={false} />);

    expect(screen.getByText("Sequencia de Dias: 0")).toBeTruthy();
    expect(screen.getByText("Seu streak está quebrado.")).toBeTruthy();
  });

  it("renderiza -- em estado de erro", () => {
    render(<SequenceBadge sequence={null} streakActive={null} isLoading={false} hasError={true} />);

    expect(screen.getByText("Sequencia de Dias: --")).toBeTruthy();
    expect(screen.getByText("Não foi possível carregar sua sequência.")).toBeTruthy();
  });

  it("renderiza skeleton enquanto carrega", () => {
    render(<SequenceBadge sequence={null} streakActive={null} isLoading={true} hasError={false} />);

    expect(screen.getByTestId("star-badge-title-skeleton")).toBeTruthy();
    expect(screen.getByTestId("star-badge-description-skeleton")).toBeTruthy();
  });
});
