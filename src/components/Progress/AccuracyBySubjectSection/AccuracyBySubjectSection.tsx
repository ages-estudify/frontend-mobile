import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { AccuracyBySubject } from "../../../types/userStats";

interface Props {
  subjects?: AccuracyBySubject[];
}

const DEFAULT_VISIBLE_ITEMS = 5;
const SEGMENTS_COUNT = 3;

const rowColorClasses = [
  "bg-accuracyPurpleDark",
  "bg-accuracyPurpleMuted",
  "bg-accuracyPurpleLight",
  "bg-accuracyPurpleLight",
  "bg-accuracyPurpleDark",
  "bg-accuracyPurpleMuted",
];

function clampPercentage(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

function getSegmentFillPercentage({
  correct,
  total,
  segmentIndex,
}: {
  correct: number;
  total: number;
  segmentIndex: number;
}) {
  if (total <= 0 || correct <= 0) {
    return 0;
  }

  const safeCorrect = Math.min(correct, total);
  const segmentSize = total / SEGMENTS_COUNT;

  const segmentStart = segmentIndex * segmentSize;
  const segmentEnd = segmentStart + segmentSize;

  if (safeCorrect >= segmentEnd) {
    return 100;
  }

  if (safeCorrect <= segmentStart) {
    return 0;
  }

  return clampPercentage(((safeCorrect - segmentStart) / segmentSize) * 100);
}

export function AccuracyBySubjectSection({ subjects = [] }: Props) {
  const [showAll, setShowAll] = useState(false);

  if (!subjects || subjects.length === 0) {
    return null;
  }

  const visibleSubjects = showAll ? subjects : subjects.slice(0, DEFAULT_VISIBLE_ITEMS);

  const hasMore = subjects.length > DEFAULT_VISIBLE_ITEMS;

  return (
    <View className="mb-[22px] rounded-[16px] border border-cardBorder bg-white px-[16px] py-[16px]">
      <View className="mb-[14px] flex-row items-center justify-between">
        <Text
          allowFontScaling={false}
          className="font-poppins-semi text-[21px] leading-[26px] text-black"
        >
          Acertos por Matéria
        </Text>

        {hasMore && (
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowAll((current) => !current)}>
            <Text
              allowFontScaling={false}
              className="font-inter text-[15px] leading-[19px] text-primaryGray"
            >
              {showAll ? "Ver menos" : "Ver tudo"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {visibleSubjects.map((subject, subjectIndex) => {
        const total = Number(subject.totalAnswered) || 0;
        const correct = Number(subject.correct) || 0;
        const colorClass = rowColorClasses[subjectIndex % rowColorClasses.length];

        return (
          <View
            key={subject.subjectId}
            className="mb-[10px] rounded-[14px] bg-progressSubjectCardBg px-[14px] py-[11px]"
          >
            <View className="mb-[8px] flex-row items-start justify-between">
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                className="mr-[10px] flex-1 font-inter text-[16px] leading-[22px] text-primaryGray"
              >
                {subject.subjectName}
              </Text>

              <View className="flex-row items-end">
                <Text
                  allowFontScaling={false}
                  className="font-poppins-semi text-[27px] leading-[31px] text-greenPrimary"
                >
                  {correct}
                </Text>

                <Text
                  allowFontScaling={false}
                  className="mb-[3px] font-inter text-[15px] leading-[18px] text-primaryGray"
                >
                  /{total}
                </Text>
              </View>
            </View>

            <View className="flex-row">
              {Array.from({ length: SEGMENTS_COUNT }).map((_, segmentIndex) => {
                const fillPercentage = getSegmentFillPercentage({
                  correct,
                  total,
                  segmentIndex,
                });

                return (
                  <View
                    key={segmentIndex}
                    className={`h-[8px] flex-1 overflow-hidden rounded-full bg-progressTrack ${
                      segmentIndex < SEGMENTS_COUNT - 1 ? "mr-[10px]" : ""
                    }`}
                  >
                    <View
                      className={`h-full rounded-full ${colorClass}`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}
