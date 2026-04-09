import { useQuestionSession } from "@/hooks/useQuestionSession";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import QuestionScreen from "../question";

jest.mock("axios", () => ({
    create: jest.fn(() => ({
        get: jest.fn(),
        post: jest.fn(),
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
    })),
    isAxiosError: jest.fn(),
}));

jest.mock("expo-router", () => ({
    useRouter: () => ({
        back: jest.fn(),
        push: jest.fn(),
    })
}));


jest.mock("../../assets/icons/back-arrow.svg", () => () => null);
jest.mock("../../assets/icons/expand.svg", () => () => null);

jest.mock("@/hooks/useQuestionSession");

jest.mock("@gorhom/bottom-sheet", () => "MockBottomSheet");

jest.mock("@/components/QuestionAnalysisBottomSheet", () => ({
    QuestionAnalysisBottomSheet: "MockQuestionAnalysisBottomSheet"
}));

const mockQuestion = {
    id: "uuid-123",
    text: "Qual é o objetivo da fotossíntese?",
    imageUrl: null,
    type: "ORIGINAL",
    foreign: false,
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

    it("NÃO deve chamar confirmAnswer diretamente ao clicar em enviar", () => {
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

        expect(mockConfirmAnswer).not.toHaveBeenCalled();
    });

    it("deve chamar confirmAnswer ao clicar em avançar dentro da modal", () => {
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

        const modal = screen.UNSAFE_getByType("MockQuestionAnalysisBottomSheet" as any);
        modal.props.onNext();

        expect(mockConfirmAnswer).toHaveBeenCalledTimes(1);
    });
})