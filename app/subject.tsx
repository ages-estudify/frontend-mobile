import { BackButton } from "@/components/BackButton";
import { QuestionTypeBottomSheet } from "@/components/QuestionTypeBottomSheet";
import { TopicStep } from "@/components/TopicStep";
import { getTopicsBySubject } from "@/services/subject.service";
import { Topic } from "@/types/subject.types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopicSeparator from "../assets/icons/separator.svg";

export default function SubjectScreen() {
  const router = useRouter();
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const { id, name } = useLocalSearchParams();

  useEffect(() => {
    const data = async () => {
      const topicsData = await getTopicsBySubject(id as string);
      setTopics(topicsData);
    };

    data();
  }, [id]);

  const [selectedTopicId, setSelectedTopicId] = React.useState<string | null>(null);
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const handlePresentModalPress = (topicId: string) => {
    setSelectedTopicId(topicId);
    bottomSheetModalRef.current?.present();
  };

  const calculateDonePercentage = useCallback((topic: Topic): number => {
    const totalQuestions = topic.availableByType.ORIGINAL + topic.availableByType.SIMPLIFIED;
    const answeredQuestions = topic.answeredByType.ORIGINAL + topic.answeredByType.SIMPLIFIED;
    return totalQuestions === 0 ? 0 : Math.round((answeredQuestions / totalQuestions) * 100);
  }, []);

  return (
    <SafeAreaView className="h-full">
      <ScrollView className="gap[8px] h-full bg-whitebg px-[16px]">
        <BackButton></BackButton>
        <Text className="mt-[24px] font-inter text-[13px] text-purple50">TRILHA SUGERIDA</Text>
        <Text className="mb-[8px] font-poppins-semi text-[40px]">{name}</Text>
        {topics.map((topic, index) => (
          <React.Fragment key={topic.id}>
            {index > 0 && (
              <View className="my-[2px] ml-[29px]">
                <TopicSeparator />
              </View>
            )}
            <TopicStep
              title={topic.name}
              description={topic.text}
              icon={topic.icon_url}
              stepNumber={index + 1}
              donePercentage={calculateDonePercentage(topic)}
              onPress={() => handlePresentModalPress(topic.id)}
            />
          </React.Fragment>
        ))}
      </ScrollView>
      <QuestionTypeBottomSheet
        modalRef={bottomSheetModalRef}
        onOriginalPress={() =>
          router.navigate(`/questions?topicId=${selectedTopicId}&type=ORIGINAL`)
        }
        onSimplifiedPress={() =>
          router.navigate(`/questions?topicId=${selectedTopicId}&type=SIMPLIFIED`)
        }
      />
    </SafeAreaView>
  );
}
