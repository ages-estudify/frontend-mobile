import { getProgressColor } from "@/utils/progress-color";
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
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

export const topicIconMap: Record<string, LucideIcon> = {
  book: BookOpen,
  calculator: Calculator,
  flask: FlaskConical,
  globe: Globe,
  language: Languages,
  atom: Atom,
};

export type TopicIconKey = keyof typeof topicIconMap | (string & {});

const DEFAULT_ICON: LucideIcon = BookOpen;
const SIZE = 60;
const ICON_SIZE = 28;
const PRESSED_SCALE = 0.96;
const PRESSED_OPACITY = 0.85;

export interface TopicNodeProps {
  iconKey: TopicIconKey;
  progressPercentage: number;
  onPress: () => void;
  accessibilityLabel: string;
}

export function getTopicNodeStyle(backgroundColor: string, _pressed: boolean): ViewStyle {
  return {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  };
}

export function TopicNode({
  iconKey,
  progressPercentage,
  onPress,
  accessibilityLabel,
}: TopicNodeProps) {
  const Icon = topicIconMap[iconKey] ?? DEFAULT_ICON;
  const backgroundColor = getProgressColor(progressPercentage);

  const pressableStyle: PressableProps["style"] = ({ pressed }) => ({
    opacity: pressed ? PRESSED_OPACITY : 1,
    transform: pressed ? [{ scale: PRESSED_SCALE }] : undefined,
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={pressableStyle as StyleProp<ViewStyle>}
    >
      <View style={getTopicNodeStyle(backgroundColor, false)}>
        <Icon size={ICON_SIZE} color="#FFFFFF" strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}
