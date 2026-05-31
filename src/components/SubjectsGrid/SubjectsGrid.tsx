import { Subject } from "@/types/subject.types";
import React from "react";
import { Text, View } from "react-native";
import SubjectBox from "../SubjectBox";

export interface SubjectsGridProps {
  subjects: Subject[];
}

export function SubjectsGrid({ subjects }: SubjectsGridProps) {
  return (
    <View className="mt-[8px] gap-[8px]">
      <Text className="font-inter-semi text-[15px]">Categorias</Text>
      <View className="flex flex-row flex-wrap justify-between">
        {subjects.map((subject) => (
          <View key={subject.id} className="mb-[16px]">
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
