import { BackButton } from "@/components/BackButton";
import { QuestionTypeBottomSheet } from "@/components/QuestionTypeBottomSheet";
import { StatCard } from "@/components/StatCard";
import { TopicTrail, type TopicTrailItem } from "@/components/TopicTrail/TopicTrail";
import { useStarsContext } from "@/contexts/StarsContext";
import { getTopicsBySubject } from "@/services/subject/subject.service";
import type { Topic } from "@/types/subject.types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Fire from "../assets/icons/fire.svg";

const starCoin = require("../assets/starCoin.png");

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
    iconUrl: topic.icon_url,
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
  const hasLoadedRef = useRef(false);

  const load = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!subjectId) return;
      if (!silent) setStatus("loading");
      try {
        const data = await getTopicsBySubject(subjectId);
        setTopics(data ?? []);
        setStatus("success");
      } catch {
        if (!silent) {
          setTopics([]);
          setStatus("error");
        }
      }
    },
    [subjectId]
  );

  useFocusEffect(
    useCallback(() => {
      load({ silent: hasLoadedRef.current });
      hasLoadedRef.current = true;
      loadStars();
    }, [load, loadStars])
  );

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
          <View
            testID="stat-card-skeleton"
            className="mb-[16px] h-[72px] rounded-2xl bg-secondaryGray"
          />
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
            onPress={() => load()}
            className="rounded-2xl bg-purple100 px-[24px] py-[12px]"
            accessibilityRole="button"
          >
            <Text className="font-inter-semi text-white">Recarregar</Text>
          </Pressable>
        </View>
      )}

      {status === "success" && (
        <View className="flex-1">
          <View
            testID="subject-stats-card"
            className="mx-[16px] mt-[16px] flex-row items-center rounded-2xl bg-white px-2 py-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <StatCard
              icon={<Fire width={28} height={32} />}
              label="Sequência de dias"
              value={`0 dias`}
            />
            <View className="mx-1 h-10 w-px bg-secondaryGray" />
            <StatCard
              icon={
                <Image source={starCoin} style={{ width: 34, height: 34 }} resizeMode="contain" />
              }
              label="Estrelas"
              value={`${stars ?? 0}`}
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
