import React from "react";
import { render, screen } from "@testing-library/react-native";
import { StarBadge } from "./StarBadge";

jest.mock("lucide-react-native", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");

  return {
    Star: (props: object) => <View {...props} testID="star-icon" />,
  };
});

describe("StarBadge", () => {
  it("renderiza o saldo corretamente", () => {
    render(
      <StarBadge
        stars={47}
        isLoading={false}
        hasError={false}
        description="Responda questões e ganhe mais"
      />
    );

    expect(screen.getByText("Estrelas: 47")).toBeTruthy();
    expect(screen.getByText("Responda questões e ganhe mais")).toBeTruthy();
  });

  it("exibe -- quando está em estado de erro", () => {
    render(
      <StarBadge
        stars={47}
        isLoading={false}
        hasError={true}
        description="Responda questões e ganhe mais"
        errorDescription="Não foi possível carregar suas estrelas."
      />
    );

    expect(screen.getByText("Estrelas: --")).toBeTruthy();
    expect(screen.getByText("Não foi possível carregar suas estrelas.")).toBeTruthy();
  });

  it("exibe skeleton em estado de loading", () => {
    render(
      <StarBadge
        stars={47}
        isLoading={true}
        hasError={false}
        description="Responda questões e ganhe mais"
      />
    );

    expect(screen.getByTestId("star-badge-title-skeleton")).toBeTruthy();
    expect(screen.getByTestId("star-badge-description-skeleton")).toBeTruthy();
    expect(screen.queryByText("Estrelas: 47")).toBeNull();
  });

  it("permite personalizar o título mantendo o mesmo visual", () => {
    render(
      <StarBadge
        stars={18}
        isLoading={false}
        hasError={false}
        title="Moedas ganhas: +18"
        description="Somadas nesta sessão."
        containerClassName="h-[76px]"
        textNumberOfLines={1}
      />
    );

    expect(screen.getByText("Moedas ganhas: +18").props.numberOfLines).toBe(1);
    expect(screen.getByText("Somadas nesta sessão.").props.numberOfLines).toBe(1);
    expect(screen.queryByText("Estrelas: 18")).toBeNull();
  });
});
