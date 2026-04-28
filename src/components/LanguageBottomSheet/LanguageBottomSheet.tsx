import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  onConfirm: (language: "ENGLISH" | "SPANISH") => void;
  onCancel: () => void;
};

export function LanguageBottomSheet({ onConfirm }: Props) {
  return (
    <BottomSheet>
      <BottomSheetView style={{ flex: 1, padding: 24 }}>
        <Text className="mb-4 text-lg font-semibold text-gray-800">Escolha o idioma da prova</Text>

        <View className="gap-3">
          <Pressable
            onPress={() => onConfirm("ENGLISH")}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <Text className="text-base font-medium text-gray-800">Inglês</Text>
          </Pressable>

          <Pressable
            onPress={() => onConfirm("SPANISH")}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <Text className="text-base font-medium text-gray-800">Espanhol</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
