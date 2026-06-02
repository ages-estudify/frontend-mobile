import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AccuracyBySubjectSection } from "./AccuracyBySubjectSection";

describe("AccuracyBySubjectSection", () => {
  it("renders nothing if array is empty", () => {
    const { queryByText } = render(<AccuracyBySubjectSection subjects={[]} />);
    expect(queryByText("Acertos por Matéria")).toBeNull();
  });

  it("renders top 5 subjects and 'Ver tudo' button when more than 5", () => {
    const subjects = Array.from({ length: 6 }).map((_, i) => ({
      subjectId: `id-${i}`,
      subjectName: `Subject ${i}`,
      correct: 10,
      totalAnswered: 20,
    }));
    const { getByText, queryByText } = render(<AccuracyBySubjectSection subjects={subjects} />);

    expect(getByText("Subject 0")).toBeTruthy();
    expect(getByText("Subject 4")).toBeTruthy();
    expect(queryByText("Subject 5")).toBeNull();

    const verTudo = getByText("Ver tudo");
    expect(verTudo).toBeTruthy();

    fireEvent.press(verTudo);
    expect(getByText("Subject 5")).toBeTruthy();
    expect(getByText("Ver menos")).toBeTruthy();
  });
});
