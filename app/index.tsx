import { SequenceStatus } from "@/components/SequenceStatus";
import { SubjectsGrid } from "@/components/SubjectsGrid";
import { useAuth } from "@/hooks/useAuth";
import { getSubjects } from "@/services/subject/subject.service";
import { Subject } from "@/types/subject.types";
import { RelativePathString, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [subjects, setSubjects] = React.useState<Subject[]>([]);

  useEffect(() => {
    const data = async () => {
      const subjectsData = await getSubjects();
      setSubjects(subjectsData);
    };
    data();
  }, []);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();

      if (!authenticated) {
        router.replace("/login" as RelativePathString);
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-whitebg dark:bg-whitebg">
      <View className="flex-1 gap-[10px] self-center px-[16px]">
        <Image
          source={require("../assets/images/placeholder_user.png")}
          style={{ width: 40, height: 40 }}
          className="h-10 w-10 self-end rounded-full"
          resizeMode="contain"
        />
        <Text className="font-poppins-semi text-[34px]">Treinar</Text>
        <SequenceStatus></SequenceStatus>
        <SubjectsGrid subjects={subjects}></SubjectsGrid>
      </View>
    </SafeAreaView>
  );
}
