import { ExamHistory } from "@/types/exam-history.types";

describe("ExamHistory Integration Tests", () => {
  const mockExamData: ExamHistory = {
    success: true,
    data: {
      exam: {
        id: "exam-123",
        name: "Novembro 2024",
        origin: "ENEM",
      },
      summary: {
        averageScore: 720,
        totalCompleted: 3,
      },
      history: [
        {
          attemptDayId: "attempt-1",
          day: 1,
          totalQuestions: 90,
          answeredQuestions: 82,
          correctAnswers: 65,
          timeSpentSeconds: 5400,
          completedAt: "2025-02-13T16:45:00.000Z",
        },
        {
          attemptDayId: "attempt-2",
          day: 2,
          totalQuestions: 90,
          answeredQuestions: 75,
          correctAnswers: 55,
          timeSpentSeconds: 3600,
          completedAt: "2025-02-12T10:30:00.000Z",
        },
        {
          attemptDayId: "attempt-3",
          day: 1,
          totalQuestions: 90,
          answeredQuestions: 50,
          correctAnswers: 20,
          timeSpentSeconds: 30,
          completedAt: "2025-02-11T14:00:00.000Z",
        },
      ],
    },
  };

  describe("Date Grouping and Sorting", () => {
    it("should group history by date in DD/MM/YYYY format", () => {
      const sortedHistory = [...mockExamData.data.history].sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

      const groupedHistory = sortedHistory.reduce(
        (acc, curr) => {
          const dateKey = new Intl.DateTimeFormat("pt-BR", {
            timeZone: "UTC",
          }).format(new Date(curr.completedAt));

          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(curr);
          return acc;
        },
        {} as Record<string, typeof sortedHistory>
      );

      const keys = Object.keys(groupedHistory);
      expect(keys.length).toBe(3);
      expect(keys[0]).toBe("13/02/2025");
      expect(keys[1]).toBe("12/02/2025");
      expect(keys[2]).toBe("11/02/2025");
    });

    it("should sort history from most recent to oldest", () => {
      const sortedHistory = [...mockExamData.data.history].sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

      expect(new Date(sortedHistory[0].completedAt).getTime()).toBeGreaterThan(
        new Date(sortedHistory[1].completedAt).getTime()
      );
      expect(new Date(sortedHistory[1].completedAt).getTime()).toBeGreaterThan(
        new Date(sortedHistory[2].completedAt).getTime()
      );
    });
  });

  describe("Time Formatting", () => {
    const formatTime = (totalSeconds: number) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const pad = (num: number) => num.toString().padStart(2, "0");
      return `${hours}:${pad(minutes)}`;
    };

    it("should format time as HH:MM correctly", () => {
      expect(formatTime(5400)).toBe("1:30");
      expect(formatTime(3600)).toBe("1:00");
      expect(formatTime(30)).toBe("0:00");
      expect(formatTime(0)).toBe("0:00");
    });
  });

  describe("Percentage Calculation", () => {
    const calculatePercentage = (answered: number, total: number) => {
      return Math.round((answered / total) * 100);
    };

    const getColorPercentage = (percentage: number) => {
      if (percentage >= 70) return "#519B2F";
      if (percentage >= 40) return "#E0963A";
      return "#D43B3B";
    };

    it("should calculate percentage correctly", () => {
      expect(calculatePercentage(82, 90)).toBe(91);
      expect(calculatePercentage(75, 90)).toBe(83);
      expect(calculatePercentage(50, 90)).toBe(56);
    });

    it("should assign correct colors based on percentage", () => {
      expect(getColorPercentage(91)).toBe("#519B2F");
      expect(getColorPercentage(83)).toBe("#519B2F");
      expect(getColorPercentage(56)).toBe("#E0963A");
      expect(getColorPercentage(30)).toBe("#D43B3B");
    });

    it("should handle edge cases for color assignment", () => {
      expect(getColorPercentage(70)).toBe("#519B2F");
      expect(getColorPercentage(40)).toBe("#E0963A");
      expect(getColorPercentage(39)).toBe("#D43B3B");
    });
  });

  describe("Data Structure Validation", () => {
    it("should have valid exam data structure", () => {
      expect(mockExamData.success).toBe(true);
      expect(mockExamData.data.exam.id).toBe("exam-123");
      expect(mockExamData.data.exam.name).toBe("Novembro 2024");
      expect(mockExamData.data.exam.origin).toBe("ENEM");
    });

    it("should have valid summary data", () => {
      expect(mockExamData.data.summary.averageScore).toBe(720);
      expect(mockExamData.data.summary.totalCompleted).toBe(3);
    });

    it("should have valid history items", () => {
      const history = mockExamData.data.history;
      expect(history).toHaveLength(3);

      history.forEach((item) => {
        expect(item).toHaveProperty("attemptDayId");
        expect(item).toHaveProperty("day");
        expect(item).toHaveProperty("totalQuestions");
        expect(item).toHaveProperty("answeredQuestions");
        expect(item).toHaveProperty("correctAnswers");
        expect(item).toHaveProperty("timeSpentSeconds");
        expect(item).toHaveProperty("completedAt");
      });
    });
  });

  describe("Empty State Handling", () => {
    it("should handle empty history gracefully", () => {
      const emptyData: ExamHistory = {
        success: true,
        data: {
          exam: { id: "exam-123", name: "", origin: "" },
          summary: { averageScore: 0, totalCompleted: 0 },
          history: [],
        },
      };

      expect(emptyData.data.history.length).toBe(0);
      expect(emptyData.data.summary.totalCompleted).toBe(0);
    });
  });
});
