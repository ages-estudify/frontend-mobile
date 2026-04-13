import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ModulePlaceholderProps = {
  title: string;
  description?: string;
};

export default function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <View className="flex-1 justify-center px-6">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{title}</Text>
        {description ? (
          <Text className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
            {description}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
