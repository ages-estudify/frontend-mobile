import { Text, View } from "react-native";

type HomeContentProps = {
  planLabel: string | null;
};

export function HomeContent({ planLabel }: HomeContentProps) {
  return (
    <View className="flex-1 justify-center px-6">
      <Text
        testID="home-title"
        className="text-2xl font-bold text-neutral-900 dark:text-neutral-100"
      >
        Início
      </Text>
      <Text className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
        Escolha um módulo na barra inferior para começar a estudar.
      </Text>
      {planLabel ? (
        <Text
          testID="home-plan-status"
          className="mt-4 text-sm text-neutral-500 dark:text-neutral-500"
        >
          Plano: {planLabel}
        </Text>
      ) : null}
    </View>
  );
}
