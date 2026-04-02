import { Subject } from "@/types/subject.types";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import SubjectBox from "./SubjectBox";

export function SubjectsGrid() {
  const subjects: Subject[] = [
    {
      id: "1",
      name: "Matemática",
      icon: "M10 20C10 19.4477 10.4477 19 11 19H13C13.5523 19 14 19.4477 14 20V22C14 22.5523 13.5523 23 13 23H11C10.4477 23 10 22.5523 10 22V20Z",
      totalQuestions: 100,
      answeredQuestions: 50,
    },
    {
      id: "2",
      name: "Matemática",
      icon: "M10 20C10 19.4477 10.4477 19 11 19H13C13.5523 19 14 19.4477 14 20V22C14 22.5523 13.5523 23 13 23H11C10.4477 23 10 22.5523 10 22V20Z",
      totalQuestions: 100,
      answeredQuestions: 50,
    },
    {
      id: "3",
      name: "Matemática",
      icon: "M10 20C10 19.4477 10.4477 19 11 19H13C13.5523 19 14 19.4477 14 20V22C14 22.5523 13.5523 23 13 23H11C10.4477 23 10 22.5523 10 22V20Z",
      totalQuestions: 100,
      answeredQuestions: 50,
    },
    {
      id: "4",
      name: "Matemática",
      icon: "M10 20C10 19.4477 10.4477 19 11 19H13C13.5523 19 14 19.4477 14 20V22C14 22.5523 13.5523 23 13 23H11C10.4477 23 10 22.5523 10 22V20Z",
      totalQuestions: 100,
      answeredQuestions: 50,
    },
    {
      id: "5",
      name: "Matemática",
      icon: "M10 20C10 19.4477 10.4477 19 11 19H13C13.5523 19 14 19.4477 14 20V22C14 22.5523 13.5523 23 13 23H11C10.4477 23 10 22.5523 10 22V20Z",
      totalQuestions: 100,
      answeredQuestions: 50,
    },
    {
      id: "6",
      name: "Matemática",
      icon: "M10 20C10 19.4477 10.4477 19 11 19H13C13.5523 19 14 19.4477 14 20V22C14 22.5523 13.5523 23 13 23H11C10.4477 23 10 22.5523 10 22V20Z",
      totalQuestions: 100,
      answeredQuestions: 50,
    },
    {
      id: "7",
      name: "Matemática",
      icon: "M10 20C10 19.4477 10.4477 19 11 19H13C13.5523 19 14 19.4477 14 20V22C14 22.5523 13.5523 23 13 23H11C10.4477 23 10 22.5523 10 22V20Z",
      totalQuestions: 100,
      answeredQuestions: 50,
    },
    {
      id: "8",
      name: "Matemática",
      icon: "M10 20C10 19.4477 10.4477 19 11 19H13C13.5523 19 14 19.4477 14 20V22C14 22.5523 13.5523 23 13 23H11C10.4477 23 10 22.5523 10 22V20Z",
      totalQuestions: 100,
      answeredQuestions: 50,
    },
    {
      id: "9",
      name: "Matemática",
      icon: "M10 20C10 19.4477 10.4477 19 11 19H13C13.5523 19 14 19.4477 14 20V22C14 22.5523 13.5523 23 13 23H11C10.4477 23 10 22.5523 10 22V20Z",
      totalQuestions: 100,
      answeredQuestions: 50,
    },
    {
      id: "10",
      name: "Matemática",
      icon: "M10 20C10 19.4477 10.4477 19 11 19H13C13.5523 19 14 19.4477 14 20V22C14 22.5523 13.5523 23 13 23H11C10.4477 23 10 22.5523 10 22V20Z",
      totalQuestions: 100,
      answeredQuestions: 50,
    },
  ];
  return (
    <ScrollView className="gap-[8px]">
      <Text className="font-inter-semi text-[15px]">Categorias</Text>
      <View className="grid grid-cols-3">
        {subjects.map((subject) => (
          <SubjectBox
            key={subject.id}
            subject={subject.name}
            icon={subject.icon}
            href={`/subject/${subject.id}`}
          />
        ))}
      </View>
    </ScrollView>
  );
}
