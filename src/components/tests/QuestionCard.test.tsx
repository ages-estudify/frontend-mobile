import { Question } from "@/types/Question";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import QuestionCard from "../QuestionCard";

jest.mock("../../../assets/icons/expand.svg", () => {
    return () => null;
});

const mockQuestion: Question = {
    id: "uuid-123",
    text: "Qual a fórmula da água?",
    imageUrl: null,
    origin: "ORIGINAL",
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
        expect(screen.getByText("Química")).toBeTruthy();
        expect(screen.getByText("Inorgânica")).toBeTruthy();
        expect(screen.getByText("Qual a fórmula da água?")).toBeTruthy();
    });

    it("deve renderizar a tag 'Questão Vestibular' quando origin for 'SIMPLIFIED'", () => {
        const mockVestibular = { ...mockQuestion, origin: 'SIMPLIFIED' as const };

        render(<QuestionCard question={mockVestibular} />);

        expect(screen.getByText("Questão Vestibular")).toBeTruthy();
    });

    it("deve abrir modal ao clicar no botão de expandir e fechar ao clicar em fechar", () => {
        render(<QuestionCard question={mockQuestion} />);

        fireEvent.press(screen.getByTestId("botao-expandir"));

        expect(screen.getByText("X")).toBeTruthy();

        fireEvent.press(screen.getByText("X"));
    })
});