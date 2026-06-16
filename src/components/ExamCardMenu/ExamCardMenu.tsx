import { TAB_BAR_HEIGHT, tabBarBottomOffset } from "@/constants/tabBarLayout";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MENU_WIDTH = 200;
const MENU_HEIGHT = 100;
const MARGIN = 12;
const ANCHOR_GAP = 8;

export type MenuAnchorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onHistory: () => void;
  onRetry: () => void;
  anchorRect?: MenuAnchorRect;
};

function computeMenuPosition(
  anchor: MenuAnchorRect | undefined,
  screen: { width: number; height: number },
  bottomLimit: number
): { top: number; left: number } {
  if (!anchor) {
    return { top: 120, left: MARGIN };
  }

  const anchorBottom = anchor.y + anchor.height;
  const spaceBelow = bottomLimit - anchorBottom - ANCHOR_GAP;
  const spaceAbove = anchor.y - MARGIN - ANCHOR_GAP;
  const openBelow = spaceBelow >= MENU_HEIGHT || spaceBelow >= spaceAbove;

  let top = openBelow ? anchorBottom + ANCHOR_GAP : anchor.y - MENU_HEIGHT - ANCHOR_GAP;
  top = Math.max(MARGIN, Math.min(top, bottomLimit - MENU_HEIGHT));

  const left = Math.min(Math.max(anchor.x, MARGIN), screen.width - MENU_WIDTH - MARGIN);

  return { top, left };
}

export function ExamCardMenu({ visible, onClose, onHistory, onRetry, anchorRect }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const bottomLimit = height - tabBarBottomOffset(insets.bottom) - TAB_BAR_HEIGHT - MARGIN;

  const { top, left } = useMemo(
    () => computeMenuPosition(anchorRect, { width, height }, bottomLimit),
    [anchorRect, width, height, bottomLimit]
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={StyleSheet.absoluteFill}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <View style={styles.backdrop} />
        </Pressable>

        <View style={[styles.menuContainer, { top, left }]}>
          <BlurView
            intensity={70}
            tint="light"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <View style={styles.menuTint} pointerEvents="none" />

          <View className="flex-1 justify-between p-[16px]">
            <Pressable
              onPress={() => {
                onClose();
                onHistory();
              }}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            >
              <View className="flex-row items-center gap-[8px]">
                <Ionicons name="time-outline" size={23} color="#111827" />
                <Text className="font-poppins-medium font-[17px] text-gray-900">
                  Histórico Tentativas
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                onClose();
                onRetry();
              }}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            >
              <View className="flex-row items-center gap-[8px]">
                <Ionicons name="repeat-outline" size={23} color="#111827" />
                <Text className="font-poppins-medium font-[17px] text-gray-900">
                  Tentar Novamente
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.32)",
  },
  menuContainer: {
    position: "absolute",
    width: MENU_WIDTH,
    height: MENU_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)",
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  menuTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
  menuItem: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
  },
  menuItemPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
});
