import React, { forwardRef, useMemo } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { QuestionAnalysisSheet } from "./QuestionAnalysisSheet";

interface QuestionAnalysisBottomSheetProps {
  isCorrect: boolean;
  correctAlternative: {
    letter: string;
    text: string;
  };
  markedAlternative?: {
    letter: string;
    text: string;
  };
  comment: string;
  onNext: () => void;
  onFinish: () => void;
}

export const QuestionAnalysisBottomSheet = forwardRef<
  BottomSheet,
  QuestionAnalysisBottomSheetProps
>(({ isCorrect, comment, onNext, onFinish, correctAlternative, markedAlternative }, ref) => {
  const snapPoints = useMemo(() => ["20%", "90%"], []);

  return (
    <BottomSheet ref={ref} index={-1} snapPoints={snapPoints} enablePanDownToClose={false}>
      <BottomSheetScrollView style={{ flex: 1, padding: 24 }}>
        <QuestionAnalysisSheet
          isCorrect={isCorrect}
          correctAlternative={correctAlternative}
          markedAlternative={markedAlternative}
          comment={comment}
          onNext={onNext}
          onFinish={onFinish}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

QuestionAnalysisBottomSheet.displayName = "QuestionAnalysisBottomSheet";
