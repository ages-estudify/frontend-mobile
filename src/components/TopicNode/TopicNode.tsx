import {
  Atom,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Languages,
  type LucideIcon,
} from "lucide-react-native";
import React from "react";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

// Design System dictionaries — keep open so new topics can be registered by simply
// assigning a key, e.g. `topicIconMap.history = History;`.
export const topicIconMap: Record<string, LucideIcon> = {
  book: BookOpen,
  calculator: Calculator,
  flask: FlaskConical,
  globe: Globe,
  language: Languages,
  atom: Atom,
};

export const topicColorMap: Record<string, string> = {
  purple: "#3E2B5C",
  green: "#519B2F",
  red: "#D43B3B",
  orange: "#FFD195",
  yellow: "#FFDE59",
  tabActive: "#9500FF",
};

export type TopicIconKey = keyof typeof topicIconMap | (string & {});
export type TopicColorKey = keyof typeof topicColorMap | (string & {});

const DEFAULT_ICON: LucideIcon = BookOpen;
const DEFAULT_COLOR = "#3E2B5C";
const SIZE = 68;
const ICON_SIZE = 32;
const PRESSED_SCALE = 0.96;
const PRESSED_OPACITY = 0.85;

export interface TopicNodeProps {
  iconKey: TopicIconKey;
  colorKey: TopicColorKey;
  onPress: () => void;
  accessibilityLabel: string;
}

export function getTopicNodeStyle(backgroundColor: string, pressed: boolean): ViewStyle {
  return {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scale: pressed ? PRESSED_SCALE : 1 }],
    opacity: pressed ? PRESSED_OPACITY : 1,
  };
}

export function TopicNode({ iconKey, colorKey, onPress, accessibilityLabel }: TopicNodeProps) {
  const Icon = topicIconMap[iconKey] ?? DEFAULT_ICON;
  const backgroundColor = topicColorMap[colorKey] ?? DEFAULT_COLOR;

  const computeStyle: PressableProps["style"] = ({ pressed }) =>
    getTopicNodeStyle(backgroundColor, pressed);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={computeStyle as StyleProp<ViewStyle>}
    >
      <Icon size={ICON_SIZE} color="#FFFFFF" />
    </Pressable>
  );
}
