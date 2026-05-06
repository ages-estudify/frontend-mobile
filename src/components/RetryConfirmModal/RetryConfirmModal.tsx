import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function RetryConfirmModal({ visible, onConfirm, onCancel }: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 28,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 24,
            width: "100%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#1a1a1a", marginBottom: 8 }}>
            Tentativa em andamento
          </Text>
          <Text style={{ fontSize: 14, color: "#888888", lineHeight: 20, marginBottom: 24 }}>
            Você já possui uma tentativa em andamento neste simulado. Ao continuar, ela será
            finalizada e uma nova será iniciada.
          </Text>

          <Pressable
            onPress={onConfirm}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#333" : "#1a1a1a",
              borderRadius: 12,
              padding: 15,
              alignItems: "center",
              marginBottom: 10,
            })}
          >
            <Text style={{ fontSize: 15, fontWeight: "600", color: "white" }}>
              Sim, iniciar nova tentativa
            </Text>
          </Pressable>

          <Pressable
            onPress={onCancel}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#F0F0F0" : "transparent",
              borderRadius: 12,
              padding: 15,
              alignItems: "center",
            })}
          >
            <Text style={{ fontSize: 15, fontWeight: "500", color: "#888888" }}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
