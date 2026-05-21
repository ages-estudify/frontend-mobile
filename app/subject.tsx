import { BackButton } from "@/components/BackButton";
import { QuestionTypeBottomSheet } from "@/components/QuestionTypeBottomSheet";
import { StatCard } from "@/components/StatCard";
import { TopicTrail, type TopicTrailItem } from "@/components/TopicTrail/TopicTrail";
import { useStarsContext } from "@/contexts/StarsContext";
import { getTopicsBySubject } from "@/services/subject/subject.service";
import type { Topic } from "@/types/subject.types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Flame, Star } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Status = "loading" | "error" | "success";
type PracticeType = "ORIGINAL" | "SIMPLIFIED";

function topicToTrailItem(topic: Topic, index: number): TopicTrailItem {
  const available =
    (topic.availableByType?.ORIGINAL ?? 0) + (topic.availableByType?.SIMPLIFIED ?? 0);
  const answered = (topic.answeredByType?.ORIGINAL ?? 0) + (topic.answeredByType?.SIMPLIFIED ?? 0);
  const progressPercentage = available === 0 ? 0 : Math.round((answered / available) * 100);

  return {
    id: topic.id,
    stageNumber: index + 1,
    name: topic.name,
    progressPercentage,
    iconKey: "book",
    colorKey: "purple",
  };
}

export default function SubjectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; name?: string }>();
  const subjectId = params.id;
  const subjectName = params.name ?? "";

  const { stars, loadStars } = useStarsContext();

  const [status, setStatus] = useState<Status>("loading");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const modalRef = useRef<BottomSheetModal>(null);

  const load = useCallback(async () => {
    if (!subjectId) return;
    setStatus("loading");
    try {
      const data = await getTopicsBySubject(subjectId);
      setTopics(data ?? []);
      setStatus("success");
    } catch {
      setTopics([]);
      setStatus("error");
    }
  }, [subjectId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadStars();
  }, [loadStars]);

  const trailItems = useMemo(() => topics.map(topicToTrailItem), [topics]);

  const handleTopicPress = (topicId: string) => {
    setSelectedTopicId(topicId);
    modalRef.current?.present();
  };

  const navigateToPractice = (type: PracticeType) => {
    modalRef.current?.dismiss();
    if (!selectedTopicId) return;
    router.navigate(`/question?topicId=${selectedTopicId}&type=${type}`);
  };

  return (
    <SafeAreaView className="h-full bg-whitebg" testID="subject-trail-screen">
      <View className="flex-row items-center px-[16px] pt-[8px]">
        <BackButton />
        <Text
          testID="subject-trail-title"
          className="flex-1 px-[8px] text-center font-poppins-semi text-[20px] text-black"
          numberOfLines={1}
        >
          {subjectName}
        </Text>
        <View className="h-[50px] w-[50px]" />
      </View>

      {status === "loading" && (
        <View testID="subject-trail-loading" className="flex-1 px-[16px] py-[16px]">
          <View className="mb-[16px] flex-row" style={{ gap: 8 }}>
            <View
              testID="stat-card-skeleton"
              className="h-[72px] flex-1 rounded-2xl bg-secondaryGray"
            />
            <View
              testID="stat-card-skeleton"
              className="h-[72px] flex-1 rounded-2xl bg-secondaryGray"
            />
          </View>
          <View testID="topic-trail-skeleton" className="flex-1 rounded-2xl bg-secondaryGray" />
        </View>
      )}

      {status === "error" && (
        <View testID="subject-trail-error" className="flex-1 items-center justify-center px-[16px]">
          <Text className="mb-[16px] text-center font-inter text-[14px] text-primaryGray">
            Não foi possível carregar os tópicos. Tente novamente.
          </Text>
          <Pressable
            testID="subject-trail-retry"
            onPress={load}
            className="rounded-2xl bg-purple100 px-[24px] py-[12px]"
            accessibilityRole="button"
          >
            <Text className="font-inter-semi text-white">Recarregar</Text>
          </Pressable>
        </View>
      )}

      {status === "success" && (
        <View className="flex-1">
          <View className="flex-row px-[16px] pt-[16px]" style={{ gap: 8 }}>
            <StatCard
              icon={<Flame size={24} color="#FFFFFF" />}
              label="Sequência de dias"
              value={`0 dias`}
              iconBgColor="#FFD195"
            />
            <StatCard
              icon={<Star size={24} color="#FFFFFF" />}
              label="Estrelas"
              value={`${stars ?? 0}`}
              iconBgColor="#FFDE59"
            />
          </View>

          {trailItems.length === 0 ? (
            <View
              testID="subject-trail-empty"
              className="flex-1 items-center justify-center px-[16px]"
            >
              <Text className="text-center font-inter text-[14px] text-primaryGray">
                Nenhum tópico disponível para esta disciplina.
              </Text>
            </View>
          ) : (
            <View className="flex-1" testID="subject-trail-content">
              <TopicTrail topics={trailItems} onTopicPress={handleTopicPress} />
            </View>
          )}
        </View>
      )}

      <QuestionTypeBottomSheet
        modalRef={modalRef}
        onOriginalPress={() => navigateToPractice("ORIGINAL")}
        onSimplifiedPress={() => navigateToPractice("SIMPLIFIED")}
      />
    </SafeAreaView>
  );
}
