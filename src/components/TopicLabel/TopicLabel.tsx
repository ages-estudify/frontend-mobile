import { ProgressBar } from "@/shared/components/ProgressBar";
import { getProgressColor } from "@/utils/progress-color";
import { Flag } from "lucide-react-native";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

export interface TopicLabelProps {
  stageNumber: number;
  topicName: string;
  progressPercentage: number;
}

export function TopicLabel({ stageNumber, topicName, progressPercentage }: TopicLabelProps) {
  const displayStageNumber = useMemo(() => {
    return String(Math.max(0, Math.trunc(stageNumber))).padStart(2, "0");
  }, [stageNumber]);

  const isSingleWord = useMemo(() => !/\s/.test(topicName.trim()), [topicName]);

  const safePercentage = Number.isNaN(progressPercentage) ? 0 : progressPercentage;
  const clampedPercentage = Math.min(100, Math.max(0, safePercentage));
  const displayPercentage = Math.round(clampedPercentage);

  return (
    <View
      testID="topic-label-container"
      className="rounded-xl bg-white px-2.5 py-2"
      style={{
        minHeight: 95,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center" style={{ gap: 4 }}>
        <Flag size={11} color="#9CA3AF" strokeWidth={2} />
        <Text testID="topic-label-stage" className="font-inter text-[12px] text-primaryGray">
          Etapa {displayStageNumber}
        </Text>
      </View>
      <Text
        testID="topic-label-name"
        className="mt-0.5 font-inter-semi text-[15px] text-black"
        numberOfLines={isSingleWord ? 1 : 2}
        adjustsFontSizeToFit={isSingleWord}
        minimumFontScale={0.6}
        ellipsizeMode="tail"
      >
        {topicName}
      </Text>
      <View className="mt-1.5 flex-row items-center">
        <View testID="topic-label-progress-track" style={{ flex: 1, minWidth: 0 }}>
          <ProgressBar percentage={clampedPercentage} color={getProgressColor(clampedPercentage)} />
        </View>
        <Text
          testID="topic-label-percentage"
          className="ml-2 font-inter-medium text-[11px]"
          style={{ color: getProgressColor(clampedPercentage) }}
        >
          {displayPercentage}%
        </Text>
      </View>
    </View>
  );
}
