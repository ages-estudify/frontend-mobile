const BASE_URL = "";

export async function fetchQuestions() {
  return {
    data: {
      questions: [
        {
          id: "1",
          text: "Qual a fórmula química da água?",
          alternatives: [
            { label: "A", text: "CO2" },
            { label: "B", text: "H2O" },
            { label: "C", text: "HCL" },
            { label: "D", text: "NaCL" },
            { label: "E", text: "O2" },
          ],
        },
        {
          id: "2",
          text: "Qual o gás que é o maior responsável pelo efeito estufa?",
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
          alternatives: [
            { label: "A", text: "2" },
            { label: "B", text: "9" },
            { label: "C", text: "5" },
            { label: "D", text: "13" },
            { label: "E", text: "7" },
          ],
        },
      ],
    },
  };
}

/*
export function sendAnswer(questionId: string, answer: string) {
    fetch(`${BASE_URL}/api/questions/${questionId}/answer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
    })
}
    */

export function sendAnswer(questionId: string, answer: string) {
  console.log("Mock:", questionId, answer);
}
