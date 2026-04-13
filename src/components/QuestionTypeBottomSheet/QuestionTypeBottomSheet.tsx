import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { Text, View } from "react-native";
import { QuestionTypeBox } from "../QuestionTypeBox";

export interface QuestionTypeBottomSheetProps {
  modalRef: React.RefObject<BottomSheetModal | null>;
  onOriginalPress?: () => void;
  onSimplifiedPress?: () => void;
}

export function QuestionTypeBottomSheet({
  modalRef,
  onOriginalPress,
  onSimplifiedPress,
}: QuestionTypeBottomSheetProps) {
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={modalRef}
        index={0}
        enableDynamicSizing={true}
        backdropComponent={BottomSheetBackdrop}
      >
        <BottomSheetView>
          <View className="flex-column w-full justify-start gap-[25px] px-[16px] pb-[64px] pt-[16px]">
            <View className="flex-column gap-[8px]">
              <Text className="font-inter-semi text-[24px]">Como você quer treinar hoje?</Text>
              <Text className="font-inter text-[13px] text-primaryGray">
                Escolha o tipo de questão para começar seu treino
              </Text>
            </View>
            <View className="flex-column w-full gap-[14px]">
              <QuestionTypeBox
                title="Questões originais da banca"
                description="Questões no formato original das provas (ENEM, UFRGS, etc.)"
                variant="original"
                onPress={onOriginalPress}
              />
              <QuestionTypeBox
                title="Questões simplificadas Estudify"
                description="Questões mais curtas para você treinar em qualquer lugar!"
                variant="simplified"
                onPress={onSimplifiedPress}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
