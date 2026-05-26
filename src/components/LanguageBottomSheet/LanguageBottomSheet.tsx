import { TAB_BAR_HEIGHT, tabBarBottomOffset } from "@/constants/tabBarLayout";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity } from "react-native";
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
      enableContentPanningGesture={false}
      enableHandlePanningGesture
      enablePanDownToClose
      onClose={onCancel}
      bottomInset={bottomInset}
      handleIndicatorStyle={{ backgroundColor: "#D0D0D0", width: 36 }}
      backgroundStyle={{ borderRadius: 20 }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} opacity={0.2} appearsOnIndex={0} disappearsOnIndex={-1} />
      )}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 32 }}
      >
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
                borderWidth: 2,
                borderColor: isSelected ? "#3e2b5c" : "#E0E0E0",
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

        <TouchableOpacity
          onPress={() => selected && onConfirm(selected)}
          disabled={!selected}
          activeOpacity={0.85}
          style={{
            borderRadius: 14,
            backgroundColor: selected ? "#3e2b5c" : "#E0E0E0",
            padding: 16,
            alignItems: "center",
            marginTop: 8,
            width: "100%",
          }}
        >
          <Text
            style={{ fontSize: 15, fontWeight: "600", color: selected ? "#FFFFFF" : "#AAAAAA" }}
          >
            Começar Simulado
          </Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
