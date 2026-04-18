import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface FinishExamModalProps {
  visible: boolean;
  blankAnswers: number;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function FinishExamModal({
  visible,
  blankAnswers,
  onConfirm,
  onCancel,
  loading = false,
}: FinishExamModalProps) {
  const hasAllAnswered = blankAnswers === 0;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 items-center justify-center bg-black/50 p-4">
        <View className="w-full max-w-sm rounded-lg bg-white p-6">
          <Text className="mb-4 text-xl font-bold text-gray-800">
            {hasAllAnswered ? "Revisar Respostas?" : "Finalizar Simulado?"}
          </Text>

          <Text className="mb-6 text-base text-gray-600">
            {hasAllAnswered ? (
              <>
                Você respondeu todas as questões.{"\n"}
                <Text className="font-semibold text-[#3E2B5C]">
                  Deseja revisar suas respostas antes de finalizar?
                </Text>
              </>
            ) : (
              <>
                Você tem{" "}
                <Text className="font-semibold text-red-500">
                  {blankAnswers} questão{blankAnswers !== 1 ? "s" : ""} não respondida
                  {blankAnswers !== 1 ? "s" : ""}
                </Text>
                . Tem certeza que deseja finalizar?
              </>
            )}
          </Text>

          <View className="flex flex-row gap-3">
            <Pressable
              onPress={onCancel}
              disabled={loading}
              className="flex-1 items-center rounded-lg bg-gray-200 py-3"
            >
              <Text className="text-base font-semibold text-gray-800">
                {hasAllAnswered ? "Finalizar Agora" : "Cancelar"}
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={loading}
              className="flex-1 items-center rounded-lg bg-[#3E2B5C] py-3"
            >
              <Text className="text-base font-semibold text-white">
                {loading
                  ? hasAllAnswered
                    ? "Finalizando..."
                    : "Finalizando..."
                  : hasAllAnswered
                    ? "Revisar"
                    : "Confirmar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
