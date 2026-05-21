import React from "react";
import { Text, View } from "react-native";
import { CompletedTopics, UserStatsLevel } from "../../types/userStats";

interface Props {
  level?: UserStatsLevel;
  completedTopics?: CompletedTopics;
  accuracyPercentage?: number;
}

export function ProgressSummaryCards({ level, completedTopics, accuracyPercentage }: Props) {
  const currentLvl = level?.current ?? 0;
  const maxLvl = level?.max ?? 10;
  const completed = completedTopics?.completed ?? 0;
  const totalTopics = completedTopics?.total ?? 4;
  const accuracy = Math.min(Math.max(accuracyPercentage ?? 0, 0), 100);

  const cardStyle = {
    borderWidth: 1,
    borderColor: "#F1F1F1",
  };

  return (
    <View className="mb-[20px] flex-row justify-between" style={{ gap: 10 }}>
      {/* Card 1 */}
      <View
        className="h-[110px] flex-1 rounded-[16px] bg-white px-[16px] pb-[10px] pt-[13px]"
        style={cardStyle}
      >
        <View className="h-[40px] justify-end">
          <View className="flex-row items-end">
            <Text className="font-poppins-semi text-[31px] leading-[34px] text-greenPrimary">
              {currentLvl}
            </Text>

            <Text className="mb-[3px] ml-[2px] font-inter-medium text-[14px] leading-[18px] text-primaryGray">
              /{maxLvl}
            </Text>
          </View>
        </View>

        <View className="mt-[8px] min-h-[34px] justify-start">
          <Text className="text-left font-inter text-[12px] leading-[16px] text-primaryGray">
            Nível atual
          </Text>
        </View>
      </View>

      {/* Card 2 */}
      <View
        className="h-[110px] flex-1 rounded-[16px] bg-white px-[16px] pb-[10px] pt-[13px]"
        style={cardStyle}
      >
        <View className="h-[40px] justify-end">
          <View className="flex-row items-end">
            <Text className="font-poppins-semi text-[31px] leading-[34px] text-greenPrimary">
              {completed}
            </Text>

            <Text className="mb-[3px] ml-[2px] font-inter-medium text-[14px] leading-[18px] text-primaryGray">
              /{totalTopics}
            </Text>
          </View>
        </View>

        <View className="mt-[8px] min-h-[34px] justify-start">
          <Text className="text-left font-inter text-[12px] leading-[16px] text-primaryGray">
            Etapas{"\n"}Completas
          </Text>
        </View>
      </View>

      {/* Card 3 */}
      <View
        className="h-[110px] flex-1 rounded-[16px] bg-white px-[16px] pb-[10px] pt-[13px]"
        style={cardStyle}
      >
        <View className="h-[40px] justify-end">
          <View className="flex-row items-start">
            <Text className="font-poppins-semi text-[31px] leading-[34px] text-greenPrimary">
              {Math.round(accuracy)}
            </Text>

            <Text className="ml-[2px] mt-[3px] font-inter-medium text-[14px] leading-[18px] text-primaryGray">
              %
            </Text>
          </View>
        </View>

        <View className="mt-[8px] min-h-[34px] justify-start">
          <Text className="text-left font-inter text-[12px] leading-[16px] text-primaryGray">
            Total{"\n"}Acertos
          </Text>
        </View>
      </View>
    </View>
  );
}
