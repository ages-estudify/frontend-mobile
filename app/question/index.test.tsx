import { useQuestionSession } from "@/hooks/useQuestionSession";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import QuestionScreen from "./index";

jest.mock("expo-router", () => ({
    useRouter: () => ({
        back: jest.fn(),
        push: jest.fn(),
    })
}));


jest.mock("../../assets/icons/back-arrow.svg", () => () => null);
jest.mock("../../assets/icons/expand.svg", () => () => null);

jest.mock("@/hooks/useQuestionSession");

const mockQuestion = {
    id: "uuid-123",
    text: "Qual é o objetivo da fotossíntese?",
    imageUrl: null,
    type: "ORIGINAL",
    foreing: false,
    subjectName: "Biologia",
    topicName: "Botânica",
    alternatives: [
        { label: "A", text: "Gerar energia a partir de luz solar" },
        { label: "B", text: "Iniciar processo de decomposição completa do ser vivo" },
    ]
};

describe("QuestionScreen Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve mostrar 'Carregando' quando loading for true", () => {
        (useQuestionSession as jest.Mock).mockReturnValue({
            loading: true,
            question: null,
            progress: { current: 0, total: 0 }
        });

        render(<QuestionScreen />);

        expect(screen.getByText("Carregando...")).toBeTruthy();
    });

    it("deve mostrar a mensagem de fim quando não houver mais questões", () => {
        (useQuestionSession as jest.Mock).mockReturnValue({
            loading: false,
            question: null,
            progress: { current: 20, total: 20 }
        });

        render(<QuestionScreen />);

        expect(screen.getByText("Todas as questões deste tipo foram respondidas neste tópico")).toBeTruthy();
    });

    it("deve chamar a função confirmAnswer ao clicar em enviar", () => {
        const mockConfirmAnswer = jest.fn();

        (useQuestionSession as jest.Mock).mockReturnValue({
            loading: false,
            question: mockQuestion,
            selected: "A",
            setSelected: jest.fn(),
            confirmAnswer: mockConfirmAnswer,
            progress: { current: 1, total: 20 }
        });

        render(<QuestionScreen />);

        const botaoEnviar = screen.getByText("Enviar");

        fireEvent.press(botaoEnviar);

        expect(mockConfirmAnswer).toHaveBeenCalledTimes(1)
    });
})