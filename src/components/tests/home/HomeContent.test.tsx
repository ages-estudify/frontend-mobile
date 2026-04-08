import React from "react";
import { render, screen } from "@testing-library/react-native";

import { HomeContent } from "../../home/HomeContent";

describe("HomeContent", () => {
  it("renderiza título e texto principal", () => {
    render(<HomeContent planLabel={null} />);
    expect(screen.getByTestId("home-title")).toHaveTextContent("Início");
    expect(screen.getByText(/barra inferior/i)).toBeTruthy();
  });

  it("exibe status do plano quando informado", () => {
    render(<HomeContent planLabel="ativo" />);
    expect(screen.getByTestId("home-plan-status")).toHaveTextContent(
      "Plano: ativo"
    );
  });
});
