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
import React, { useState } from "react";
import {
  Image,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

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
const REMOTE_ICON_WIDTH = 40;
const REMOTE_ICON_HEIGHT = 40;
const PRESSED_SCALE = 0.96;
const PRESSED_OPACITY = 0.85;

export interface TopicNodeProps {
  iconKey: TopicIconKey;
  iconUrl?: string;
  progressPercentage: number;
  onPress: () => void;
  accessibilityLabel: string;
  scale?: number;
}

export function getTopicNodeStyle(backgroundColor: string, size: number = SIZE): ViewStyle {
  return {
    width: size,
    height: size,
    borderRadius: size / 2,
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
  iconUrl,
  progressPercentage,
  onPress,
  accessibilityLabel,
  scale = 1,
}: TopicNodeProps) {
  const [remoteFailed, setRemoteFailed] = useState(false);
  const Icon = topicIconMap[iconKey] ?? DEFAULT_ICON;
  const backgroundColor = getProgressColor(progressPercentage);
  const showRemote = Boolean(iconUrl) && !remoteFailed;

  const size = SIZE * scale;
  const iconSize = ICON_SIZE * scale;
  const remoteWidth = REMOTE_ICON_WIDTH * scale;
  const remoteHeight = REMOTE_ICON_HEIGHT * scale;

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
      <View testID="topic-node-circle" style={getTopicNodeStyle(backgroundColor, size)}>
        {showRemote ? (
          <Image
            source={{ uri: iconUrl }}
            style={{ width: remoteWidth, height: remoteHeight }}
            resizeMode="contain"
            onError={() => setRemoteFailed(true)}
          />
        ) : (
          <Icon size={iconSize} color="#FFFFFF" strokeWidth={2.5} />
        )}
      </View>
    </Pressable>
  );
}
