import React from "react";
import { Dimensions, Modal, Pressable, Text, useWindowDimensions, View } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MENU_WIDTH = 210;
const MENU_HEIGHT = 120;
const MARGIN = 12;

type Props = {
  visible: boolean;
  onClose: () => void;
  onHistory: () => void;
  onRetry: () => void;
  anchorPosition?: { x: number; y: number };
};

export function ExamCardMenu({ visible, onClose, onHistory, onRetry, anchorPosition }: Props) {
  const { width } = useWindowDimensions();

  const safeTop = Math.min(
    Math.max(anchorPosition?.y ?? 120, MARGIN),
    SCREEN_HEIGHT - MENU_HEIGHT - MARGIN
  );

  const safeLeft = Math.min(Math.max(anchorPosition?.x ?? 20, MARGIN), width - MENU_WIDTH - MARGIN);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <View
          style={{
            position: "absolute",
            top: safeTop,
            left: safeLeft,
            backgroundColor: "white",
            borderRadius: 16,
            paddingVertical: 4,
            width: MENU_WIDTH,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Pressable
            onPress={() => {
              onClose();
              onHistory();
            }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: pressed ? "#F5F5F5" : "white",
              borderRadius: 12,
            })}
          >
            <Text style={{ fontSize: 18, marginRight: 12 }}>🕐</Text>
            <Text style={{ fontSize: 15, fontWeight: "500", color: "#1a1a1a" }}>
              Histórico Tentativas
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              onClose();
              onRetry();
            }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: pressed ? "#F5F5F5" : "white",
              borderRadius: 12,
            })}
          >
            <Text style={{ fontSize: 18, marginRight: 12 }}>🔁</Text>
            <Text style={{ fontSize: 15, fontWeight: "500", color: "#1a1a1a" }}>
              Tentar Novamente
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
