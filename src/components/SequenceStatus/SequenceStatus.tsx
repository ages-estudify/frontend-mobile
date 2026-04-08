import React from "react";
import { Text, View } from "react-native";
import { SequenceBox } from "../SequenceBox";

export function SequenceStatus() {
  return (
    <View className="gap-[9px]">
      <Text className="font-inter-semi text-[15px]">Sequência</Text>
      <SequenceBox title="Sequência de Dias" value={10} description="Continue treinando!" />
      <SequenceBox
        title="Estrelas"
        value={3}
        description="Responda questões e ganhe mais"
        variant="stars"
      ></SequenceBox>
    </View>
  );
}
