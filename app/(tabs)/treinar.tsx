import { GatedTabScreenHeader } from "@/components/navigation/GatedTabScreenHeader";
import { PlanGuard } from "@/components/navigation/PlanGuard";
import { TabScreenScrollView } from "@/components/navigation/TabScreenScrollView";
import { SequenceBadgeContainer } from "@/components/SequenceBadgeContainer";
import { StarBadgeContainer } from "@/components/StarBadgeContainer";
import { SubjectsGrid } from "@/components/SubjectsGrid";
import { useAuth } from "@/hooks/useAuth";
import { getSubjects } from "@/services/subject/subject.service";
import { Subject } from "@/types/subject.types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function TreinarMainContent() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = async () => {
      const subjectsData = await getSubjects();
      setSubjects(subjectsData);
      setLoading(false);
    };
    data();
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
  const { logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-whitebg dark:bg-whitebg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <GatedTabScreenHeader
          title="Treinar"
          trailing={
            <Pressable onPress={() => logout()}>
              <Image
                source={require("../../assets/placeholder_user.png")}
                style={{ width: 40, height: 40 }}
                className="h-10 w-10 rounded-full"
                resizeMode="contain"
              />
            </Pressable>
          }
        />
        <PlanGuard>
          <TreinarMainContent />
        </PlanGuard>
      </View>
    </SafeAreaView>
  );
}
