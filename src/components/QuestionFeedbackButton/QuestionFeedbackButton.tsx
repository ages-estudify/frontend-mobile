import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

export type Feedback = "Correct" | "Incorrect" | "Blank";

interface props {
  number: number;
  feedback: Feedback;
  ghost?: boolean;
}

export default function QuestionFeedbackButton({ number, feedback, ghost = false }: props) {
  let backgroundColor = "";
  let textColor = "";

  if (feedback == "Correct") {
    backgroundColor = "bg-green12";
    textColor = "text-greenGrid";
  } else if (feedback == "Incorrect") {
    backgroundColor = "bg-red12";
    textColor = "text-red100";
  } else {
    backgroundColor = "bg-primaryGray/20";
    textColor = "text-primaryGray";
  }

  return (
    <>
      {ghost == false ? (
        <View className={`h-[60px] w-20 ${backgroundColor} items-center justify-center rounded-lg`}>
          <Text className={`${textColor} text-xl`}>{number}</Text>
        </View>
      ) : (
        <View className={`h-[60px] w-20 items-center justify-center rounded-lg`}></View>
      )}
    </>
  );
}
