import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QuestionTypeBox } from "./QuestionTypeBox";

export interface QuestionTypeBottomSheetProps {
  modalRef: React.RefObject<BottomSheetModal | null>;
}

export function QuestionTypeBottomSheet({ modalRef }: QuestionTypeBottomSheetProps) {
  return (
    <GestureHandlerRootView className="p-none">
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={modalRef}
          index={0}
          enableDynamicSizing={true}
          backdropComponent={BottomSheetBackdrop}
        >
          <BottomSheetView>
            <View className="flex-column align-items-center justify-start gap-[25px] px-[16px] py-[24px]">
              <View className="flex-column gap-[8px]">
                <Text className="font-inter-semi text-[24px]">Como você quer treinar hoje?</Text>
                <Text className="font-inter text-[13px] text-primaryGray">
                  Escolha o tipo de questão para começar seu treino
                </Text>
              </View>
              <View className="flex-column gap-[14px]">
                <QuestionTypeBox
                  title="Questões originais da banca"
                  description="Questões no formato original das provas (ENEM, UFRGS, etc.)"
                  icon="https://example.com/multiple-choice-icon.png"
                />
                <QuestionTypeBox
                  title="Questões simplificadas Estudify"
                  description="Questões mais curtas para você treinar em qualquer lugar!"
                  icon="https://example.com/true-false-icon.png"
                />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
