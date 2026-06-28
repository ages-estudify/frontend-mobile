import { GatedTabScreenHeader } from "@/components/navigation/GatedTabScreenHeader";
import { PlanGuard } from "@/components/navigation/PlanGuard";
import { ProfileAvatarButton } from "@/components/navigation/ProfileAvatarButton";
import { TabScreenScrollView } from "@/components/navigation/TabScreenScrollView";
import { SequenceBadgeContainer } from "@/components/SequenceBadgeContainer";
import { StarBadgeContainer } from "@/components/StarBadgeContainer";
import { SubjectsGrid } from "@/components/SubjectsGrid";
import { useStars } from "@/hooks/useStars";
import { useStreak } from "@/hooks/useStreak";
import { getSubjects } from "@/services/subject/subject.service";
import { Subject } from "@/types/subject.types";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function TreinarMainContent() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { loadStars } = useStars();
  const { loadStreak } = useStreak();

  useFocusEffect(
    useCallback(() => {
      loadStars();
      loadStreak();
    }, [loadStars, loadStreak])
  );

  useEffect(() => {
    let mounted = true;

    const loadSubjects = async () => {
      try {
        const subjectsData = await getSubjects();

        if (mounted) {
          setSubjects(subjectsData);
        }
      } catch (error) {
        console.log("Erro ao buscar disciplinas:", error);

        if (mounted) {
          setSubjects([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSubjects();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <TabScreenScrollView>
      <View className="gap-[10px] self-center px-[16px]">
        <Text className="font-inter-semi text-[15px]">Sequência</Text>
        <SequenceBadgeContainer variant="treinar" />
        <StarBadgeContainer variant="treinar" />
        <SubjectsGrid subjects={subjects} />
      </View>
    </TabScreenScrollView>
  );
}

export default function TreinarRoute() {
  return (
    <SafeAreaView className="flex-1 bg-whitebg dark:bg-whitebg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <GatedTabScreenHeader title="Treinar" trailing={<ProfileAvatarButton />} />
        <PlanGuard>
          <TreinarMainContent />
        </PlanGuard>
      </View>
    </SafeAreaView>
  );
}
