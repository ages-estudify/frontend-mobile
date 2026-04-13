import { Subject, Topic } from "@/types/subject.types";
import api from "../api";

export const getSubjects = async (): Promise<Subject[]> => {
  const response = await api.get("/subjects");
  return response.data;
};

export const getTopicsBySubject = async (subjectId: string): Promise<Topic[]> => {
  const response = await api.get(`/subjects/${subjectId}/topics`);
  return response.data;
};
