import { Question } from "@/types/questions.types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, Modal, Pressable, Text, View } from "react-native";
import XIcon from "../../../assets/icons/close-purple.svg";
import { ActionButton } from "../ActionButton";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
  questions: Question[];
  currentQuestionIndex: number;
  onGoToQuestion: (index: number) => void;
  onFinishExam: () => void;
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export function QuestionGridModal({
  visible,
  onClose,
  questions,
  currentQuestionIndex,
  onGoToQuestion,
  onFinishExam,
}: Props) {
  const QUESTIONS_PER_PAGE = 35;

  const pages = useMemo(() => chunkArray(questions, QUESTIONS_PER_PAGE), [questions]);

  const flatListRef = useRef<FlatList<Question[]>>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const pageFromQuestion = Math.floor(currentQuestionIndex / QUESTIONS_PER_PAGE);

  useEffect(() => {
    if (visible) {
      setCurrentPage(pageFromQuestion);

      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: pageFromQuestion,
          animated: false,
        });
      }, 50);
    }
  }, [visible, currentQuestionIndex]);

  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-[#F6F6F6]">
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: insets.top + 28,
            right: 20,
            zIndex: 10,
          }}
          className="rounded-full bg-white p-4"
        >
          <XIcon width={16} height={16} />
        </Pressable>

        <View style={{ paddingTop: insets.top + 90 }} className="flex-1">
          <Text className="pl-6 text-2xl font-semibold">Grade de Questões</Text>

          <FlatList
            ref={flatListRef}
            data={pages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            initialScrollIndex={pageFromQuestion}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={(e) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentPage(page);
            }}
            renderItem={({ item, index: pageIndex }) => (
              <View style={{ width, paddingHorizontal: 12 }}>
                <View className="flex flex-row flex-wrap justify-center">
                  {item.map((q, i) => {
                    const globalIndex = pageIndex * QUESTIONS_PER_PAGE + i;
                    const isCurrent = globalIndex === currentQuestionIndex;
                    const isAnswered = !!q.selectedAlternativeId;

                    let bg = "#FFF";
                    if (isCurrent) bg = "#3E2B5C";
                    else if (isAnswered) bg = "#3E2B5C33";

                    return (
                      <View
                        key={q.id}
                        style={{
                          flexBasis: "20%",
                          padding: 6,
                        }}
                      >
                        <Pressable
                          onPress={() => {
                            onGoToQuestion(globalIndex);
                            onClose();
                          }}
                          style={{ backgroundColor: bg }}
                          className="aspect-square items-center justify-center rounded-lg border border-[#3E2B5C]"
                        >
                          <Text
                            className={`text-xl font-bold ${
                              isCurrent ? "text-white" : "text-gray-700"
                            }`}
                          >
                            {q.number ?? globalIndex + 1}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          />
        </View>

        <View className="flex-row justify-center py-2">
          {pages.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index: i,
                  animated: true,
                });
                setCurrentPage(i);
              }}
              hitSlop={10}
              className="p-2"
            >
              <View
                className={`h-2 w-2 rounded-full ${
                  i === currentPage ? "bg-[#3E2B5C]" : "bg-gray-300"
                }`}
              />
            </Pressable>
          ))}
        </View>

        <View style={{ paddingBottom: insets.bottom + 16 }} className="px-4 pt-2">
          <ActionButton text="Finalizar Simulado" action={onFinishExam} />
        </View>
      </View>
    </Modal>
  );
}
