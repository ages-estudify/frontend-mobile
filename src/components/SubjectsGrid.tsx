import { Subject } from "@/types/subject.types";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import SubjectBox from "./SubjectBox";

export interface SubjectsGridProps {
  subjects: Subject[];
}

export function SubjectsGrid({ subjects }: SubjectsGridProps) {
  return (
    <ScrollView className="gap-[8px]">
      <Text className="font-inter-semi text-[15px]">Categorias</Text>
      <View className="grid grid-cols-3">
        {subjects.map((subject) => (
          <SubjectBox
            key={subject.id}
            subject={subject.name}
            icon={subject.icon}
            href={`/subject?id=${subject.id}&name=${subject.name}`}
          />
        ))}
      </View>
    </ScrollView>
  );
}
