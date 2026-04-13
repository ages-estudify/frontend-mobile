export type MainTabIonIcon =
  | "home-outline"
  | "barbell-outline"
  | "document-text-outline"
  | "calendar-outline"
  | "stats-chart-outline";

export type MainTabDefinition = {
  name: "treinar" | "simulado" | "cronograma" | "progresso";
  title: string;
  tabBarAccessibilityLabel: string;
  icon: MainTabIonIcon;
  /** Exige planActive para acessar (tab + PlanGuard nas rotas). */
  planGated: boolean;
};

export const MAIN_TAB_DEFINITIONS: MainTabDefinition[] = [
  {
    name: "treinar",
    title: "Treinar",
    tabBarAccessibilityLabel: "Aba Treinar",
    icon: "barbell-outline",
    planGated: true,
  },
  {
    name: "simulado",
    title: "Simulado",
    tabBarAccessibilityLabel: "Aba Simulado",
    icon: "document-text-outline",
    planGated: true,
  },
  {
    name: "progresso",
    title: "Progresso",
    tabBarAccessibilityLabel: "Aba Progresso",
    icon: "stats-chart-outline",
    planGated: true,
  },
  {
    name: "cronograma",
    title: "Cronograma",
    tabBarAccessibilityLabel: "Aba Cronograma",
    icon: "calendar-outline",
    planGated: true,
  },
];
