import { QuestionAnalysisBottomSheet } from "@/components/QuestionAnalysisBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { Redirect } from "expo-router";
import React, { useRef } from "react";
import { Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // const bottomSheetRef = useRef<BottomSheet>(null)

  // function handleOpenAnalysis() {
  //   bottomSheetRef.current?.snapToIndex(1)
  // }

  // return (
  //   <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950">
  //     <View className="flex-1">
  //       <Button title="Abrir bottom sheet" onPress={handleOpenAnalysis} />

  //       <QuestionAnalysisBottomSheet
  //         ref={bottomSheetRef}
  //         isCorrect={false}
  //         comment="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
  //         onNext={() => { }}
  //         onFinish={() => { }}
  //         correctAlternative={{
  //           letter: 'B',
  //           text: 'Teste',
  //         }}
  //         markedAlternative={{
  //           letter: 'A',
  //           text: 'Outro teste',
  //         }}
  //       />
  //     </View>
  //   </SafeAreaView>
  // )
  return <Redirect href="/login" />;
}
