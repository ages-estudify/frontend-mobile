import React from "react";
import { Text, View } from "react-native";
import { CompletedTopics, UserStatsLevel } from "../../types/userStats";

interface Props {
  level?: UserStatsLevel;
  completedTopics?: CompletedTopics;
  accuracyPercentage?: number;
}

function SummaryCard({
  mainValue,
  secondaryValue,
  label,
}: {
  mainValue: React.ReactNode;
  secondaryValue?: React.ReactNode;
  label: string;
}) {
  return (
    <View className="h-[110px] flex-1 rounded-[16px] border border-cardBorder bg-white px-[16px] pb-[10px] pt-[13px]">
      <View className="h-[40px] justify-end">
        <View className="flex-row items-end">
          <Text className="font-poppins-semi text-[31px] leading-[34px] text-greenPrimary">
            {mainValue}
          </Text>

          {secondaryValue && (
            <Text className="mb-[3px] ml-[2px] font-inter-medium text-[14px] leading-[18px] text-primaryGray">
              {secondaryValue}
            </Text>
          )}
        </View>
      </View>

      <View className="mt-[8px] min-h-[34px] justify-start">
        <Text className="text-left font-inter text-[12px] leading-[16px] text-primaryGray">
          {label}
        </Text>
      </View>
    </View>
  );
}

export function ProgressSummaryCards({ level, completedTopics, accuracyPercentage }: Props) {
  const currentLvl = level?.current ?? 0;
  const maxLvl = level?.max ?? 10;
  const completed = completedTopics?.completed ?? 0;
  const totalTopics = completedTopics?.total ?? 4;
  const accuracy = Math.min(Math.max(accuracyPercentage ?? 0, 0), 100);

  return (
    <View className="mb-[20px] flex-row justify-between" style={{ gap: 10 }}>
      <SummaryCard mainValue={currentLvl} secondaryValue={`/${maxLvl}`} label="Nível atual" />
      <SummaryCard
        mainValue={completed}
        secondaryValue={`/${totalTopics}`}
        label={`Etapas\nCompletas`}
      />
      <SummaryCard mainValue={Math.round(accuracy)} secondaryValue="%" label={`Total\nAcertos`} />
    </View>
  );
}
