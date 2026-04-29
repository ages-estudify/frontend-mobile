import { TAB_BAR_HEIGHT, tabBarBottomOffset } from "@/constants/tabBarLayout";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Language = "ENGLISH" | "SPANISH";

type Props = {
  onConfirm: (language: Language) => void;
  onCancel: () => void;
};

export function LanguageBottomSheet({ onConfirm, onCancel }: Props) {
  const [selected, setSelected] = useState<Language | null>(null);
  const insets = useSafeAreaInsets();
  const bottomInset = tabBarBottomOffset(insets.bottom) + TAB_BAR_HEIGHT + 8;

  const options: { label: string; value: Language }[] = [
    { label: "Inglês", value: "ENGLISH" },
    { label: "Espanhol", value: "SPANISH" },
  ];

  return (
    <BottomSheet
      snapPoints={["45%"]}
      enablePanDownToClose
      onClose={onCancel}
      bottomInset={bottomInset}
      detached={true}
      style={{ marginHorizontal: 0 }}
      handleIndicatorStyle={{ backgroundColor: "#D0D0D0", width: 36 }}
      backgroundStyle={{ borderRadius: 20 }}
    >
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 4 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 }}>
          Escolha o idioma
        </Text>
        <Text style={{ fontSize: 13, color: "#888888", lineHeight: 18, marginBottom: 20 }}>
          Selecione qual língua estrangeira deseja responder no simulado
        </Text>

        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setSelected(option.value)}
              style={{
                borderRadius: 12,
                borderWidth: isSelected ? 2 : 0.5,
                borderColor: isSelected ? "#1a1a1a" : "#E0E0E0",
                backgroundColor: "#FFFFFF",
                padding: 16,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#1a1a1a" }}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => selected && onConfirm(selected)}
          disabled={!selected}
          style={({ pressed }) => ({
            borderRadius: 14,
            backgroundColor: selected ? (pressed ? "#333333" : "#1a1a1a") : "#E0E0E0",
            padding: 16,
            alignItems: "center",
            marginTop: 8,
          })}
        >
          <Text
            style={{ fontSize: 15, fontWeight: "600", color: selected ? "#FFFFFF" : "#AAAAAA" }}
          >
            Começar Simulado
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}
