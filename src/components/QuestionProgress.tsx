import React, { Text, View } from "react-native";

type Props = {
  progress: {
    current: number;
    total: number;
  };
};

function QuestionProgress({ progress }: Props) {
  return (
    <View className="mb-1">
      <Text className="mt-1 text-right text-sm font-medium text-gray-400">
        {progress.current} / {progress.total}
      </Text>
      <View className="h-1.5 overflow-hidden rounded-full bg-gray-300">
        <View
          className="h-1.5 bg-greenGrid"
          style={{ width: `${(progress.current / progress.total) * 100}%` }}
        />
      </View>
    </View>
  );
}

export default QuestionProgress;
