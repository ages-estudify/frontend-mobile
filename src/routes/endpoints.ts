export const endPoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
  },

  otp: {
    create: "/otp/create",
    verify: "/otp/verify",
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
    history: (examId: string) => `/exams/${examId}/history`,
  },
  questions: {
    answer: (questionId: string) => `/questions/${questionId}/answer`,
    trainingResult: "/questions/training/result",
  },
  users: {
    profile: (userId: string) => `/users/${userId}`,
    preferences: "/users/preferences",
    me: "/users/me",
    streak: "/users/streak",
    stats: "/users/stats",
    profilePicture: "/users/profile-picture",
    updatePassword: "/users/update/password",
  },
};
