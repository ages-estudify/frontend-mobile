import { AccuracyBySubject, UserStatsResponse } from "../types/userStats";

const baseAccuracyBySubject: AccuracyBySubject[] = [
  {
    subjectId: "matematica",
    subjectName: "Matemática",
    correct: 10,
    totalAnswered: 24,
  },
  {
    subjectId: "portugues",
    subjectName: "Português",
    correct: 9,
    totalAnswered: 23,
  },
  {
    subjectId: "literatura",
    subjectName: "Literatura",
    correct: 7,
    totalAnswered: 18,
  },
  {
    subjectId: "redacao",
    subjectName: "Redação",
    correct: 4,
    totalAnswered: 10,
  },
  {
    subjectId: "historia",
    subjectName: "História",
    correct: 2,
    totalAnswered: 14,
  },
  {
    subjectId: "geografia",
    subjectName: "Geografia",
    correct: 8,
    totalAnswered: 20,
  },
  {
    subjectId: "sociologia",
    subjectName: "Sociologia",
    correct: 6,
    totalAnswered: 12,
  },
  {
    subjectId: "filosofia",
    subjectName: "Filosofia",
    correct: 5,
    totalAnswered: 13,
  },
  {
    subjectId: "biologia",
    subjectName: "Biologia",
    correct: 15,
    totalAnswered: 20,
  },
  {
    subjectId: "fisica",
    subjectName: "Física",
    correct: 6,
    totalAnswered: 16,
  },
  {
    subjectId: "quimica",
    subjectName: "Química",
    correct: 5,
    totalAnswered: 15,
  },
  {
    subjectId: "ingles",
    subjectName: "Inglês",
    correct: 11,
    totalAnswered: 18,
  },
  {
    subjectId: "espanhol",
    subjectName: "Espanhol",
    correct: 4,
    totalAnswered: 12,
  },
  {
    subjectId: "artes",
    subjectName: "Artes",
    correct: 3,
    totalAnswered: 8,
  },
  {
    subjectId: "educacao-fisica",
    subjectName: "Educação Física",
    correct: 2,
    totalAnswered: 6,
  },
];

export const populatedUserStatsMock: UserStatsResponse = {
  data: {
    overview: {
      totalAnswered: 156,
      totalCorrect: 42,
      accuracyPercentage: 27,
    },
    level: {
      current: 6,
      max: 10,
    },
    completedTopics: {
      completed: 0,
      total: 4,
    },
    stars: 3,
    streak: 10,
    simulados: [
      {
        attemptId: "123e4567-e89b-12d3-a456-426614174000",
        examName: "Simulado ENEM | Janeiro",
        date: "2026-01-15",
        days: [
          {
            day: 1,
            label: "Dia 1",
            correct: 15,
            total: 45,
            scorePercentage: 30,
          },
          {
            day: 2,
            label: "Dia 2",
            correct: 32,
            total: 45,
            scorePercentage: 70,
          },
        ],
      },
      {
        attemptId: "223e4567-e89b-12d3-a456-426614174001",
        examName: "Simulado FUVEST | Fevereiro",
        date: "2026-02-10",
        days: [
          {
            day: 1,
            label: "Dia 1",
            correct: 45,
            total: 90,
            scorePercentage: 50,
          },
          {
            day: 2,
            label: "Dia 2",
            correct: 9,
            total: 90,
            scorePercentage: 10,
          },
        ],
      },
    ],
    accuracyBySubject: baseAccuracyBySubject,
  },
};

export const emptyUserStatsMock: UserStatsResponse = {
  data: {
    overview: {
      totalAnswered: 0,
      totalCorrect: 0,
      accuracyPercentage: 0,
    },
    level: {
      current: 0,
      max: 10,
    },
    completedTopics: {
      completed: 0,
      total: 4,
    },
    stars: 0,
    streak: 0,
    simulados: [],
    accuracyBySubject: baseAccuracyBySubject.map((subject) => ({
      ...subject,
      correct: 0,
    })),
  },
};
