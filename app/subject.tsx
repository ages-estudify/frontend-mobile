import { BackButton } from "@/components/BackButton";
import { QuestionTypeBottomSheet } from "@/components/QuestionTypeBottomSheet";
import { TopicStep } from "@/components/TopicStep";
import { getTopicsBySubject } from "@/services/subject.service";
import { Topic } from "@/types/subject.types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopicSeparator from "../assets/icons/separator.svg";

export default function SubjectScreen() {
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const { id, name } = useLocalSearchParams();

  useEffect(() => {
    const data = async () => {
      const topicsData = await getTopicsBySubject(id as string);
      setTopics(topicsData);
    };

    data();
  }, [id]);

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const handlePresentModalPress = (topicId: string) => {
    bottomSheetModalRef.current?.present(topicId);
  };

  return (
    <SafeAreaView className="h-full">
      <View className="gap[px] h-full px-[16px]">
        <BackButton></BackButton>
        <Text className="font-inter text-[13px] text-purple50">TRILHA SUGERIDA</Text>
        <Text className="font-poppins-semi text-[40px]">{name}</Text>
        {topics.map((topic, index) => (
          <React.Fragment key={topic.id}>
            {index > 0 && <TopicSeparator className="my-[8px] ml-[29px]" />}
            <TopicStep
              title={topic.name}
              description={topic.description}
              stepNumber={1}
              donePercentage={50}
              onPress={() => handlePresentModalPress(topic.id)}
            />
          </React.Fragment>
        ))}
        <QuestionTypeBottomSheet modalRef={bottomSheetModalRef} />
      </View>
    </SafeAreaView>
  );
}
