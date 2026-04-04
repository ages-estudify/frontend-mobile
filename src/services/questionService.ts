
const BASE_URL = "http://localhost:3000";


type FetchParams = {
    topicId: string;
    type: "ORIGINAL" | "SIMPLIFIED";
    limit?: number;
    excludeAnswered?: boolean;
};

export async function fetchQuestions({
    topicId,
    type,
    limit = 10,
    excludeAnswered = true,
}: FetchParams) {
    const url = new URL(`${BASE_URL}/api/questions/${topicId}`);

    url.searchParams.append("type", type);
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("excludeAnswered", String(excludeAnswered));

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error("Erro ao buscar questões")
    }

    const data = await response.json();

    return data;
}

export async function sendAnswer(questionId: string, answer: string) {
    const response = await fetch(`${BASE_URL}/api/questions/${questionId}/answer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
    });

    if (!response.ok) {
        throw new Error("Erro ao enviar resposta")
    }
}

/* MOCK
return {
    data: {
        questions: [
            {
                id: "1",
                text: "Qual a fórmula química da água?",
                type,
                alternatives: [
                    { label: "A", text: "CO2" },
                    { label: "B", text: "H2O" },
                    { label: "C", text: "HCl" },
                    { label: "D", text: "NaCl" },
                    { label: "E", text: "O2" },
                ],
            },
            {
                id: "2",
                text: "Qual o gás que é o maior responsável pelo efeito estufa?",
                type,
                alternatives: [
                    { label: "A", text: "Gás Hélio - He" },
                    { label: "B", text: "Nitrogênio - N2" },
                    { label: "C", text: "Oxigênio - O2" },
                    { label: "D", text: "Dióxido de Carbono - CO2" },
                    { label: "E", text: "Hidrogênio - H2" },
                ],
            },
            {
                id: "3",
                text: "Qual o pH aproximado de uma solução neutra a 25°C?",
                type,
                alternatives: [
                    { label: "A", text: "2" },
                    { label: "B", text: "9" },
                    { label: "C", text: "5" },
                    { label: "D", text: "13" },
                    { label: "E", text: "7" },
                ],
            },
        ],
        sessionProgress: {
            current: 0,
            total: 20,
        },
    },
}
*/
