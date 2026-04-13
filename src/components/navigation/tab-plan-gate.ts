import { MAIN_TAB_DEFINITIONS } from "./main-tabs";

export const PLAN_GATED_TAB_NAMES = MAIN_TAB_DEFINITIONS.filter((d) => d.planGated).map(
  (d) => d.name
) as readonly ("treinar" | "simulados" | "cronograma" | "progresso")[];

export type PlanGatedTabName = (typeof PLAN_GATED_TAB_NAMES)[number];

export function isPlanGatedTabName(name: string): name is PlanGatedTabName {
  return (PLAN_GATED_TAB_NAMES as readonly string[]).includes(name);
}

export type TabPressEvent = { preventDefault(): void };

export function createPlanGateTabListeners(
  planActive: boolean,
  onBlockedPress: () => void
): { tabPress: (e: TabPressEvent) => void } | undefined {
  if (planActive) return undefined;
  return {
    tabPress: (e) => {
      e.preventDefault();
      onBlockedPress();
    },
  };
}
