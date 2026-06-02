import { endPoints } from "@/routes/endpoints";
import {
  AttemptResponse,
  CreateAttemptRequest,
  CreatedAttemptResponse,
  FinishAttemptRequest,
  FinishAttemptResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "@/types/exam.types";
import api from "../api";

export const attemptExamService = {
  createAttempt: async (
    examId: string,
    body: CreateAttemptRequest
  ): Promise<CreatedAttemptResponse> => {
    const response: CreatedAttemptResponse = await api.post(endPoints.exams.attempts(examId), body);
    return response;
  },
  getLatestAttempt: async (examId: string): Promise<AttemptResponse> => {
    const response: AttemptResponse = await api.get(endPoints.exams.latestAttempt(examId));
    return response;
  },
  submitAnswer: async (
    questionId: string,
    body: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse> => {
    const response: SubmitAnswerResponse = await api.post(
      endPoints.questions.answer(questionId),
      body
    );
    return response;
  },
  finishAttempt: async (
    attemptId: string,
    body: FinishAttemptRequest
  ): Promise<FinishAttemptResponse> => {
    const response: FinishAttemptResponse = await api.post(
      endPoints.exams.finishAttempt(attemptId),
      body
    );
    return response;
  },
};
