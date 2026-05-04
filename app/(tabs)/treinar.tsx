import { LockedFeature } from "@/components/LockedFeature";
import { PlanGuard } from "@/components/navigation/PlanGuard";
import { TabScreenScrollView } from "@/components/navigation/TabScreenScrollView";
import { SequenceBadgeContainer } from "@/components/SequenceBadgeContainer";
import { StarBadgeContainer } from "@/components/StarBadgeContainer";
import { SubjectsGrid } from "@/components/SubjectsGrid";
import { getSubjects } from "@/services/subject/subject.service";
import { Subject } from "@/types/subject.types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

function TreinarContent() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

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
      <View className="flex-1 items-center justify-center bg-whitebg">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-whitebg">
      <TabScreenScrollView>
        <View className="gap-[10px] self-center px-[16px] pt-2">
          <Text className="font-inter-semi text-[15px] text-black">Sequência</Text>

          <SequenceBadgeContainer variant="treinar" />

          <StarBadgeContainer variant="treinar" />

          <SubjectsGrid subjects={subjects} />
        </View>
      </TabScreenScrollView>
    </View>
  );
}

export default function TreinarRoute() {
  return (
    <PlanGuard fallback={<LockedFeature />}>
      <TreinarContent />
    </PlanGuard>
  );
}