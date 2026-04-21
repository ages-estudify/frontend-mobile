import {
  createPlanGateTabListeners,
  isPlanGatedTabName,
  PLAN_GATED_TAB_NAMES,
} from "@/components/navigation/tab-plan-gate";

describe("tab-plan-gate", () => {
  it("define abas que dependem de plano", () => {
    expect(PLAN_GATED_TAB_NAMES).toEqual(["treinar", "simulado", "progresso", "cronograma"]);
  });

  it("isPlanGatedTabName", () => {
    expect(isPlanGatedTabName("treinar")).toBe(true);
    expect(isPlanGatedTabName("home")).toBe(false);
  });

  it("sem listeners com plano ativo", () => {
    expect(createPlanGateTabListeners(true, jest.fn())).toBeUndefined();
  });

  it("bloqueia toque e chama callback sem plano", () => {
    const onBlocked = jest.fn();
    const listeners = createPlanGateTabListeners(false, onBlocked);
    const preventDefault = jest.fn();
    listeners!.tabPress({ preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(onBlocked).toHaveBeenCalled();
  });
});
