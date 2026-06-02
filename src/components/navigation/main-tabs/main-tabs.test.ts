import { MAIN_TAB_DEFINITIONS } from "@/components/navigation/main-tabs";

describe("MAIN_TAB_DEFINITIONS (barra inferior)", () => {
  it("renderiza configuração das 4 abas com títulos esperados", () => {
    expect(MAIN_TAB_DEFINITIONS).toHaveLength(4);
    expect(MAIN_TAB_DEFINITIONS.map((d) => d.title)).toEqual([
      "Treinar",
      "Simulados",
      "Progresso",
      "Cronograma",
    ]);
  });

  it("todas as abas são planGated e possuem tabBarImage", () => {
    expect(MAIN_TAB_DEFINITIONS.every((d) => d.planGated)).toBe(true);
    expect(MAIN_TAB_DEFINITIONS.every((d) => d.tabBarImage)).toBe(true);
  });
});
