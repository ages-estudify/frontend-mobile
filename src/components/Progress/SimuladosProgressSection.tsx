import { Link, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CircularProgress } from "./CircularProgress";
interface SimuladoDay {
  day: number;
  label: string;
  correct: number;
  total: number;
  scorePercentage: number;
}
interface Simulado {
  attemptId: string;
  examName: string;
  date: string;
  days: SimuladoDay[];
}
interface Props {
  simulados?: Simulado[];
}
export function SimuladosProgressSection({ simulados = [] }: Props) {
  const router = useRouter();
  const hasSimulados = simulados.length > 0;
  return (
    <View className="mb-[18px] rounded-[16px] border border-cardBorder bg-white px-[16px] py-[16px]">
      <Text
        allowFontScaling={false}
        className="mb-[16px] font-poppins-semi text-[19px] leading-[24px] text-black"
      >
        Histórico de Simulados
      </Text>
      {!hasSimulados ? (
        <View className="items-center rounded-[16px] bg-progressSubjectCardBg px-[20px] py-[28px]">
          <Text
            allowFontScaling={false}
            className="mb-[8px] text-center font-inter-semi text-[16px] leading-[20px] text-black"
          >
            Você ainda não tem simulados
          </Text>
          <Text
            allowFontScaling={false}
            className="mb-[18px] text-center font-inter text-[14px] leading-[19px] text-primaryGray"
          >
            Comece um novo simulado e{"\n"}alcance sua aprovação
          </Text>
          <Link href="/(tabs)/simulado" asChild>
            <Link href="/(tabs)/simulado" asChild>
              <TouchableOpacity className="rounded-[999px] bg-purpleCalm px-[18px] py-[10px]">
                <Text allowFontScaling={false} className="font-inter-semi text-[14px] text-white">
                  Começar Simulado
                </Text>
              </TouchableOpacity>
            </Link>
          </Link>
        </View>
      ) : (
        <View className="gap-y-[12px]">
          {simulados.map((simulado) => (
            <View
              key={simulado.attemptId}
              className="rounded-[16px] bg-whitebg px-[16px] py-[16px]"
            >
              <Text
                allowFontScaling={false}
                className="mb-[18px] font-inter-semi text-[16px] leading-[20px] text-greenPrimary"
              >
                {simulado.examName}
              </Text>
              <View className="flex-row justify-between">
                {simulado.days.map((day) => (
                  <View key={`${simulado.attemptId}-${day.day}`} className="flex-1 items-center">
                    <CircularProgress
                      percentage={day.scorePercentage}
                      label={day.label}
                      size={92}
                      strokeWidth={12}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
