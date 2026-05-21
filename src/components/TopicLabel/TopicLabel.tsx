import { ProgressBar } from "@/shared/components/ProgressBar";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

export interface TopicLabelProps {
  stageNumber: number;
  topicName: string;
  progressPercentage: number;
}

const PROGRESS_BAR_WIDTH_PERCENT = 70;

export function TopicLabel({ stageNumber, topicName, progressPercentage }: TopicLabelProps) {
  const displayStageNumber = useMemo(() => {
    return String(Math.max(0, Math.trunc(stageNumber))).padStart(2, "0");
  }, [stageNumber]);

  const safePercentage = Number.isNaN(progressPercentage) ? 0 : progressPercentage;
  const clampedPercentage = Math.min(100, Math.max(0, safePercentage));
  const displayPercentage = Math.round(clampedPercentage);

  return (
    <View
      testID="topic-label-container"
      className="rounded-xl bg-white p-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <Text testID="topic-label-stage" className="font-inter text-[12px] text-primaryGray">
        Etapa {displayStageNumber}
      </Text>
      <Text testID="topic-label-name" className="mt-0.5 font-inter-semi text-[15px] text-purple100">
        {topicName}
      </Text>
      <View className="mt-2 flex-row items-center">
        <View
          testID="topic-label-progress-track"
          style={{ width: `${PROGRESS_BAR_WIDTH_PERCENT}%` }}
        >
          <ProgressBar percentage={clampedPercentage} color="#519B2F" />
        </View>
        <Text
          testID="topic-label-percentage"
          className="ml-2 font-inter-medium text-[12px] text-primaryGray"
        >
          {displayPercentage}%
        </Text>
      </View>
    </View>
  );
}
