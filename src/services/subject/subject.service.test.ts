import type { Subject, Topic } from "@/types/subject.types";

jest.mock("../api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

import subjectApi from "../api";
import { getSubjects, getTopicsBySubject } from "./subject.service";

const mockedGet = subjectApi.get as jest.Mock;

describe("subject.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSubjects", () => {
    it("calls GET /subjects and returns the response body", async () => {
      const subjects: Subject[] = [
        {
          id: "s1",
          name: "Matemática",
          icon_url: "https://example.com/icon.png",
          totalQuestions: 100,
          answeredQuestions: 10,
        },
      ];
      mockedGet.mockResolvedValue({ data: subjects });

      const result = await getSubjects();

      expect(mockedGet).toHaveBeenCalledWith("/subjects");
      expect(result).toEqual(subjects);
    });
  });

  describe("getTopicsBySubject", () => {
    it("calls GET /subjects/:id/topics and returns the response body", async () => {
      const topics: Topic[] = [
        {
          id: "t1",
          name: "Funções",
          icon_key: "https://example.com/t.png",
          text: "Descrição",
          availableByType: { ORIGINAL: 5, SIMPLIFIED: 3 },
          answeredByType: { ORIGINAL: 1, SIMPLIFIED: 0 },
        },
      ];
      mockedGet.mockResolvedValue({ data: topics });

      const result = await getTopicsBySubject("s1");

      expect(mockedGet).toHaveBeenCalledWith("/subjects/s1/topics");
      expect(result).toEqual(topics);
    });
  });
});
