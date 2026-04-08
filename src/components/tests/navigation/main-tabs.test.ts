import { MAIN_TAB_DEFINITIONS } from "@/components/navigation/main-tabs";

describe("MAIN_TAB_DEFINITIONS (barra inferior)", () => {
  it("renderiza configuração das 5 abas com títulos esperados", () => {
    expect(MAIN_TAB_DEFINITIONS).toHaveLength(5);
    expect(MAIN_TAB_DEFINITIONS.map((d) => d.title)).toEqual([
      "Início",
      "Treinar",
      "Simulados",
      "Cronograma",
      "Progresso",
    ]);
  });

  it("somente Início não é planGated", () => {
    const gated = MAIN_TAB_DEFINITIONS.filter((d) => d.planGated);
    expect(gated).toHaveLength(4);
    expect(MAIN_TAB_DEFINITIONS.find((d) => d.name === "home")?.planGated).toBe(
      false
    );
  });
});
