import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React, { createRef } from "react";
import { QuestionTypeBottomSheet } from "./QuestionTypeBottomSheet";

jest.mock("@gorhom/bottom-sheet", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");

  const MockBottomSheetModalProvider = ({ children }: { children: React.ReactNode }) => (
    <View>{children}</View>
  );

  const MockBottomSheetModal = React.forwardRef(
    ({ children, ...props }: { children: React.ReactNode }, ref: React.Ref<unknown>) => (
      <View ref={ref} {...props}>
        {children}
      </View>
    )
  );
  MockBottomSheetModal.displayName = "MockBottomSheetModal";

  const MockBottomSheetView = ({ children, ...props }: { children: React.ReactNode }) => (
    <View {...props}>{children}</View>
  );

  return {
    __esModule: true,
    BottomSheetModalProvider: MockBottomSheetModalProvider,
    BottomSheetModal: MockBottomSheetModal,
    BottomSheetView: MockBottomSheetView,
    BottomSheetBackdrop: () => null,
  };
});

jest.mock("../QuestionTypeBox", () => {
  const React = jest.requireActual("react");
  const { Pressable, Text } = jest.requireActual("react-native");
  return {
    QuestionTypeBox: ({ title, onPress }: { title: string; onPress?: () => void }) => (
      <Pressable onPress={onPress} accessibilityRole="button">
        <Text>{title}</Text>
      </Pressable>
    ),
  };
});

describe("QuestionTypeBottomSheet", () => {
  it("renders title, subtitle, and both question type options", () => {
    const modalRef = createRef<BottomSheetModal>();

    render(
      <QuestionTypeBottomSheet
        modalRef={modalRef}
        onOriginalPress={jest.fn()}
        onSimplifiedPress={jest.fn()}
      />
    );

    expect(screen.getByText("Como você quer treinar hoje?")).toBeTruthy();
    expect(screen.getByText("Escolha o tipo de questão para começar seu treino")).toBeTruthy();
    expect(screen.getByText("Questões originais da banca")).toBeTruthy();
    expect(screen.getByText("Questões simplificadas Estudify")).toBeTruthy();
  });

  it("invokes onOriginalPress and onSimplifiedPress when options are pressed", () => {
    const modalRef = createRef<BottomSheetModal>();
    const onOriginalPress = jest.fn();
    const onSimplifiedPress = jest.fn();

    render(
      <QuestionTypeBottomSheet
        modalRef={modalRef}
        onOriginalPress={onOriginalPress}
        onSimplifiedPress={onSimplifiedPress}
      />
    );

    fireEvent.press(screen.getByText("Questões originais da banca"));
    fireEvent.press(screen.getByText("Questões simplificadas Estudify"));

    expect(onOriginalPress).toHaveBeenCalledTimes(1);
    expect(onSimplifiedPress).toHaveBeenCalledTimes(1);
  });
});
