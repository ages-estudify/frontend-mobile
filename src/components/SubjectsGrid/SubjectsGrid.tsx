import { Subject } from "@/types/subject.types";
import React from "react";
import { Text, useWindowDimensions, View } from "react-native";
import SubjectBox from "../SubjectBox";

export interface SubjectsGridProps {
  subjects: Subject[];
}

const NUM_COLUMNS = 3;
const HORIZONTAL_PADDING = 16;
const GAP = 8;

export function SubjectsGrid({ subjects }: SubjectsGridProps) {
  const { width } = useWindowDimensions();

  const itemWidth = (width - HORIZONTAL_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  return (
    <View className="mt-[8px] gap-[8px]">
      <Text className="font-inter-semi text-[15px]">Categorias</Text>
      <View className="flex flex-row flex-wrap gap-[8px]">
        {subjects.map((subject) => (
          <View key={subject.id} style={{ width: itemWidth }}>
            <SubjectBox
              subject={subject.name}
              icon={subject.icon_url}
              href={`/subject?id=${subject.id}&name=${encodeURIComponent(subject.name)}`}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
