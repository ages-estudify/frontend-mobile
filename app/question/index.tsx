import { useQuestionSession } from "@/hooks/useQuestionSession";
import { Text, TouchableOpacity, View } from "react-native";

export default function QuestionScreen() {
  const { question, selected, setSelected, confirmAnswer } = useQuestionSession(
    "1",
    "ORIGINAL"
  );

  if (!question) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-lg mb-4">{question.text}</Text>
      {question.alternatives.map((alt) => (
        <TouchableOpacity
          key={alt.label}
          onPress={() => setSelected(alt.label)}
          className={`p-4 mb-2 rounded-x1 ${
            selected === alt.label ? "bg-purple-600" : "bg-gray-200"
          }`}
        >
          <Text className="text-black">
            {alt.label} {alt.text}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={confirmAnswer}
        disabled={!selected}
        className={`mt-4 p-4 rounded-x1 ${
          selected ? "bg-purple-600" : "bg-gray-400"
        }`}
      >
        <Text className="text-white text-center">Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}
