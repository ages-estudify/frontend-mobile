export const endPoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
  },

  subscriptions: {
    create: "/subscriptions",
  },

  onboarding: {
    submit: `/onboarding`,
  },
  schedule: {
    create: `/schedule`,
    week: `/schedule`,
    completeItem: (itemId: string) => `/schedule/items/${itemId}/complete`,
  },
  exams: {
    attempts: (examId: string) => `/exams/${examId}/attempts`,
    latestAttempt: (examId: string) => `/exams/${examId}/attempts/latest`,
    finishAttempt: (attemptId: string) => `/exams/attempts/${attemptId}/finish`,
  },
  questions: {
    answer: (questionId: string) => `/questions/${questionId}/answer`,
  },
};
