import { Subject, Topic } from "@/types/subject.types";
import api from "./api";

const USE_API_MOCKS =
  process.env.EXPO_PUBLIC_API_MOCKS === "true" ||
  (__DEV__ && process.env.EXPO_PUBLIC_API_URL === undefined);

const MOCK_SUBJECTS: Subject[] = [
  {
    id: "math",
    name: "Matemática",
    icon: "https://img.icons8.com/fluency/96/000000/calculator.png",
    totalQuestions: 120,
    answeredQuestions: 32,
  },
  {
    id: "physics",
    name: "Física",
    icon: "https://img.icons8.com/fluency/96/000000/atom.png",
    totalQuestions: 88,
    answeredQuestions: 18,
  },
  {
    id: "portuguese",
    name: "Português",
    icon: "https://img.icons8.com/fluency/96/000000/book.png",
    totalQuestions: 96,
    answeredQuestions: 54,
  },
];

const MOCK_TOPICS_BY_SUBJECT: Record<string, Topic[]> = {
  math: [
    {
      id: "math-algebra",
      name: "Álgebra",
      icon: "https://img.icons8.com/fluency/96/000000/algebra.png",
      description: "Resolução de equações, sistemas e expressões algébricas.",
      availableByType: {
        ORIGINAL: 14,
        SIMPLIFIED: 18,
      },
      answeredByType: {
        ORIGINAL: 4,
        SIMPLIFIED: 6,
      },
    },
    {
      id: "math-geometry",
      name: "Geometria",
      icon: "https://img.icons8.com/fluency/96/000000/ruler.png",
      description: "Figuras, ângulos, áreas e ângulos em provas de vestibular.",
      availableByType: {
        ORIGINAL: 12,
        SIMPLIFIED: 16,
      },
      answeredByType: {
        ORIGINAL: 8,
        SIMPLIFIED: 10,
      },
    },
  ],
  physics: [
    {
      id: "physics-mechanics",
      name: "Mecânica",
      icon: "https://img.icons8.com/fluency/96/000000/gears.png",
      description: "Movimento, forças e energia em situações de prova.",
      availableByType: {
        ORIGINAL: 10,
        SIMPLIFIED: 14,
      },
      answeredByType: {
        ORIGINAL: 3,
        SIMPLIFIED: 5,
      },
    },
    {
      id: "physics-electro",
      name: "Eletromagnetismo",
      icon: "https://img.icons8.com/fluency/96/000000/electrical.png",
      description: "Campo elétrico, corrente e circuitos simples.",
      availableByType: {
        ORIGINAL: 8,
        SIMPLIFIED: 12,
      },
      answeredByType: {
        ORIGINAL: 2,
        SIMPLIFIED: 4,
      },
    },
  ],
  portuguese: [
    {
      id: "portuguese-grammar",
      name: "Gramática",
      icon: "https://img.icons8.com/fluency/96/000000/grammar.png",
      description: "Ortografia, regência, concordância e análise sintática.",
      availableByType: {
        ORIGINAL: 16,
        SIMPLIFIED: 20,
      },
      answeredByType: {
        ORIGINAL: 11,
        SIMPLIFIED: 13,
      },
    },
    {
      id: "portuguese-literature",
      name: "Literatura",
      icon: "https://img.icons8.com/fluency/96/000000/literature.png",
      description: "Interpretação de texto e análise literária para provas.",
      availableByType: {
        ORIGINAL: 14,
        SIMPLIFIED: 18,
      },
      answeredByType: {
        ORIGINAL: 6,
        SIMPLIFIED: 9,
      },
    },
  ],
};

const sleep = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getSubjects(): Promise<Subject[]> {
  if (USE_API_MOCKS) {
    await sleep();
    return MOCK_SUBJECTS;
  }

  const response = await api.get("/subjects");
  return response.data;
}

export async function getTopicsBySubject(subjectId: string): Promise<Topic[]> {
  if (USE_API_MOCKS) {
    await sleep();
    return MOCK_TOPICS_BY_SUBJECT[subjectId] ?? [];
  }

  const response = await api.get(`/subjects/${subjectId}/topics`);
  return response.data;
}
