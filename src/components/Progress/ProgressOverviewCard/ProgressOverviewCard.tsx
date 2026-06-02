import React from "react";
import { Text, View } from "react-native";
import { UserStatsOverview } from "../../../types/userStats";

interface Props {
  overview?: UserStatsOverview;
}

function ProgressGeneralIcon() {
  return (
    <View className="mr-2 flex-row items-end">
      <View className="mr-[2px] h-[10px] w-[4px] rounded-[2px] bg-purple100" />
      <View className="mr-[2px] h-[15px] w-[4px] rounded-[2px] bg-purple100" />
      <View className="mr-[2px] h-[21px] w-[4px] rounded-[2px] bg-purple100" />
      <View className="mr-[2px] h-[13px] w-[4px] rounded-[2px] bg-purple100" />
    </View>
  );
}

export function ProgressOverviewCard({ overview }: Props) {
  const totalAnswered = overview?.totalAnswered ?? 0;
  const totalCorrect = overview?.totalCorrect ?? 0;
  const accuracyPercentage = overview?.accuracyPercentage ?? 0;

  const clampedPercentage = Math.min(Math.max(accuracyPercentage, 0), 100);

  return (
    <View className="mb-[18px] rounded-[16px] border border-cardBorder bg-white px-[15px] py-[14px]">
      <View className="mb-[20px] flex-row items-center">
        <ProgressGeneralIcon />
        <Text className="font-poppins-semi text-[18px] leading-[24px] text-purple100">
          Progresso Geral
        </Text>
      </View>

      <Text className="mb-[7px] font-inter-medium text-[12px] leading-[16px] text-greenPrimary">
        Aproveitamento
      </Text>

      <View className="h-[7px] w-full overflow-hidden rounded-full bg-progressTrack">
        <View
          className="h-full rounded-full bg-progressPurple"
          style={{ width: `${clampedPercentage}%` }}
        />
      </View>

      <View className="mt-[18px] flex-row items-center justify-center" style={{ gap: 44 }}>
        <View className="w-[70px] items-center">
          <Text className="font-poppins-semi text-[22px] leading-[28px] text-greenPrimary">
            {totalAnswered}
          </Text>
          <Text className="mt-[1px] font-inter text-[12px] leading-[15px] text-primaryGray">
            Questões
          </Text>
        </View>

        <View className="w-[70px] items-center">
          <Text className="font-poppins-semi text-[22px] leading-[28px] text-greenPrimary">
            {totalCorrect}
          </Text>
          <Text className="mt-[1px] font-inter text-[12px] leading-[15px] text-primaryGray">
            Corretas
          </Text>
        </View>
      </View>
    </View>
  );
}
