import { StarBadgeContainer } from "@/components/StarBadgeContainer";
import { SubjectsGrid } from "@/components/SubjectsGrid";
import { getSubjects } from "@/services/subject/subject.service";
import { Subject } from "@/types/subject.types";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [subjects, setSubjects] = React.useState<Subject[]>([]);

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-whitebg dark:bg-whitebg">
      <View className="flex-1 gap-[10px] self-center px-[16px]">
        <Image
          source={require("../assets/placeholder_user.png")}
          style={{ width: 40, height: 40 }}
          className="h-10 w-10 self-end rounded-full"
          resizeMode="contain"
        />
        <Text className="font-poppins-semi text-[34px]">Treinar</Text>
        <StarBadgeContainer variant="treinar" />
        <StarBadgeContainer variant="treinar" />
        <Link href="/register">
          <Text className="mt-6 font-semibold text-blue-600 dark:text-blue-400">Criar conta</Text>
        </Link>
        <SubjectsGrid subjects={subjects}></SubjectsGrid>
      </View>
    </SafeAreaView>
  );
}
