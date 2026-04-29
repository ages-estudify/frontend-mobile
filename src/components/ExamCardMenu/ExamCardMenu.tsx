import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onHistory: () => void;
  onRetry: () => void;
  anchorPosition?: { x: number; y: number };
};

export function ExamCardMenu({ visible, onClose, onHistory, onRetry, anchorPosition }: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <View
          style={{
            position: "absolute",
            top: anchorPosition?.y ?? 120,
            left: anchorPosition?.x ?? 20,
            backgroundColor: "white",
            borderRadius: 16,
            paddingVertical: 4,
            minWidth: 210,
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
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: pressed ? "#F5F5F5" : "white",
              borderRadius: 12,
            })}
          >
            <Text style={{ fontSize: 18 }}>🕐</Text>
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
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: pressed ? "#F5F5F5" : "white",
              borderRadius: 12,
            })}
          >
            <Text style={{ fontSize: 18 }}>🔁</Text>
            <Text style={{ fontSize: 15, fontWeight: "500", color: "#1a1a1a" }}>
              Tentar Novamente
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
