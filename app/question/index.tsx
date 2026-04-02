import { useQuestionSession } from "@/hooks/useQuestionSession";
import { Text, TouchableOpacity, View } from "react-native";

export default function QuestionScreen() {
  const { question, selected, setSelected, confirmAnswer, loading } =
    useQuestionSession("1", "ORIGINAL");

  if (loading || !question) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-100 justify-between">
      {/* Progresso */}
      <View className="h-2 bg-gray-300 rounded-full overflow-hidden">
        <View className="h2- bg-purple-600 w-1/3" />
      </View>

      {/* Card da questão */}
      <View className="bg-white rounded-2x1 p-5 shadow-md mt-6">
        <Text className="text-lg font-semibold text-gray-800">
          {question.text}
        </Text>
      </View>

      {/* Alternativas */}
      <View className="mt-6">
        {question.alternatives.map((alt) => {
          const isSelected = selected === alt.label;
          return (
            <TouchableOpacity
              key={alt.label}
              onPress={() => setSelected(alt.label)}
              className={`p-4 mb-3 rounded-xl border ${
                isSelected
                  ? "bg-purple-100 border-purple-600"
                  : "bg-white border-gray-300"
              }`}
            >
              <View className="flex-row items-center space-x-3">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    isSelected ? "bg-[#5E4980]" : "bg-gray-400"
                  }`}
                >
                  <Text
                    className={`font-bold ${isSelected ? "text-white" : "text-gray-700"}`}
                  >
                    {alt.label}
                  </Text>
                </View>
                <Text className="text-black flex items-center justify-center">
                  {alt.text}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Botão */}
      <TouchableOpacity
        onPress={confirmAnswer}
        disabled={!selected}
        className={`p-4 rounded-xl ${
          selected ? "bg-purple-600" : "bg-gray-400"
        }`}
      >
        <Text className="text-white text-center font-bold">Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

{
  /*
            <Text className="text-align mb-4 ">{question.text}</Text>
            {question.alternatives.map((alt) => (
                <TouchableOpacity
                    key={alt.label}
                    onPress={() => setSelected(alt.label)}
                    className={`p-4 mb-2 rounded-xl ${selected === alt.label ? 'border-2 border-[#5E4980] bg-white' : 'border-2 border-gray-200 bg-white'
                        }`
                    }
                >
                    <View className='space-x-2 flex flex-row'>
                        <Text className='bg-[#5E4980] rounded-full w-8 h-8 flex items-center justify-center'>
                            {alt.label}
                        </Text>
                        <Text className='text-black flex items-center justify-center'>
                            {alt.text}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}

            <TouchableOpacity
                onPress={confirmAnswer}
                disabled={!selected}
                className={`mt-4 p-4 rounded-xl ${selected ? 'bg-[#5E4980]' : 'bg-gray-400'
                    }`}
            >
                <Text className="text-center">
                    Enviar
                </Text>
            </TouchableOpacity>
        </View>
    )
        */
}
