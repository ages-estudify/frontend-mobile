import { ImageSourcePropType } from "react-native";

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
  tabBarImage: ImageSourcePropType;
  planGated: boolean;
};

export const MAIN_TAB_DEFINITIONS: MainTabDefinition[] = [
  {
    name: "treinar",
    title: "Treinar",
    tabBarAccessibilityLabel: "Aba Treinar",
    tabBarImage: require("../../../../assets/tabIcons/workout_symbol.png"),
    planGated: true,
  },
  {
    name: "simulado",
    title: "Simulados",
    tabBarAccessibilityLabel: "Aba Simulados",
    tabBarImage: require("../../../../assets/tabIcons/simulate_symbol.png"),
    planGated: true,
  },
  {
    name: "progresso",
    title: "Progresso",
    tabBarAccessibilityLabel: "Aba Progresso",
    tabBarImage: require("../../../../assets/tabIcons/progress_symbol.png"),
    planGated: true,
  },
  {
    name: "cronograma",
    title: "Cronograma",
    tabBarAccessibilityLabel: "Aba Cronograma",
    tabBarImage: require("../../../../assets/tabIcons/schedule_symbol.png"),
    planGated: true,
  },
];
