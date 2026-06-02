import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";
import { PlanCard, CARD_W } from "./PlanCard";
import type { Plan } from "./PlanCard";

const basePlan: Plan = {
  planType: "MONTHLY" as Plan["planType"],
  title: "Plano Mensal",
  price: "R$ 19,90",
  period: "por mês",
  paymentNote: "Cobrança recorrente\nR$ 19,90/mês",
  features: ["Simulados ilimitados", "Estatísticas detalhadas"],
};

describe("PlanCard", () => {
  it("exporta CARD_W como número positivo", () => {
    expect(typeof CARD_W).toBe("number");
    expect(CARD_W).toBeGreaterThan(0);
  });

  it("renderiza título, preço e período", () => {
    render(<PlanCard plan={basePlan} isActive={false} isLoading={false} onSubscribe={jest.fn()} />);
    expect(screen.getByText("Plano Mensal")).toBeTruthy();
    expect(screen.getByText("R$ 19,90")).toBeTruthy();
    expect(screen.getByText("por mês")).toBeTruthy();
  });

  it("renderiza as features", () => {
    render(<PlanCard plan={basePlan} isActive={false} isLoading={false} onSubscribe={jest.fn()} />);
    expect(screen.getByText("Simulados ilimitados")).toBeTruthy();
    expect(screen.getByText("Estatísticas detalhadas")).toBeTruthy();
  });

  it("exibe o botão Assinar agora e dispara onSubscribe", () => {
    const onSubscribe = jest.fn();
    render(
      <PlanCard plan={basePlan} isActive={false} isLoading={false} onSubscribe={onSubscribe} />
    );
    fireEvent.press(screen.getByText("Assinar agora"));
    expect(onSubscribe).toHaveBeenCalledTimes(1);
  });

  it("exibe loading indicator quando isLoading e isActive", () => {
    render(<PlanCard plan={basePlan} isActive isLoading onSubscribe={jest.fn()} />);
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    expect(screen.queryByText("Assinar agora")).toBeNull();
  });

  it("expõe testID subscribe-button quando isActive", () => {
    render(<PlanCard plan={basePlan} isActive isLoading={false} onSubscribe={jest.fn()} />);
    expect(screen.getByTestId("subscribe-button")).toBeTruthy();
  });
});
