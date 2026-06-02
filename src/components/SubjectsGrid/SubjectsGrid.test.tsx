import { render, screen } from "@testing-library/react-native";
import React from "react";
import { SubjectsGrid } from "./SubjectsGrid";
import type { Subject } from "@/types/subject.types";

jest.mock("../SubjectBox", () => {
  const React = jest.requireActual("react");
  const { Text } = jest.requireActual("react-native");
  return function MockSubjectBox({ subject, href }: { subject: string; href: string }) {
    return <Text>{`${subject}|${href}`}</Text>;
  };
});

describe("SubjectsGrid", () => {
  it("renders heading and a row per subject with correct href", () => {
    const subjects: Subject[] = [
      {
        id: "s1",
        name: "Física",
        icon_url: "https://x/icon.png",
        totalQuestions: 20,
        answeredQuestions: 0,
      },
      {
        id: "s2",
        name: "Química",
        icon_url: "https://x/icon2.png",
        totalQuestions: 15,
        answeredQuestions: 5,
      },
    ];

    render(<SubjectsGrid subjects={subjects} />);

    expect(screen.getByText("Categorias")).toBeTruthy();
    expect(
      screen.getByText(`Física|/subject?id=s1&name=${encodeURIComponent("Física")}`)
    ).toBeTruthy();
    expect(
      screen.getByText(`Química|/subject?id=s2&name=${encodeURIComponent("Química")}`)
    ).toBeTruthy();
  });

  it("renders empty grid when there are no subjects", () => {
    render(<SubjectsGrid subjects={[]} />);

    expect(screen.getByText("Categorias")).toBeTruthy();
    expect(screen.queryByText(/^\w+\|\/subject\?/)).toBeNull();
  });
});
