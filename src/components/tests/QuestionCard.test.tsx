import React from "react";
import { render, screen } from "@testing-library/react-native";
import QuestionCard from "../QuestionCard";
import { Question } from "@/types/Question";

const mockQuestion: Question = {
    id: "uuid-123",
    text: "Qual a fórmula da água?",
    imageUrl: null,
    type: "ORIGINAL",
    foreing: false,
    subjectName: "Química",
    topicName: "Inorgânica",
    alternatives: [
        { label: "A", text: "H2O" },
        { label: "B", text: "CO2" },
        { label: "C", text: "H2CO3" },
        { label: "D", text: "HCl" },
        { label: "E", text: "NaCl" }
    ]
};

describe("QuestionCard Component", () => {
    it("deve renderizar as tags dinâmicas e texto corretamente", () => {
        render(<QuestionCard question={mockQuestion} />);

        expect(screen.getByText("Questão Estudify")).toBeTruthy();
    })
})