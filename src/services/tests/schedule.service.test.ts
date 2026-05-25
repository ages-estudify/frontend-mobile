import { endPoints } from "@/routes/endpoints";
import api, { handleApiError } from "@/services/api";
import { scheduleService } from "@/services/schedule.service";

jest.mock("@/services/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
  },
  handleApiError: jest.fn((error: unknown) => {
    throw error;
  }),
}));

describe("scheduleService", () => {
  const mockWeek = {
    weekStart: "2026-05-19",
    weekEnd: "2026-05-25",
    days: [
      {
        date: "2026-05-19",
        dayOfWeek: "MONDAY",
        items: [
          {
            id: "item-1",
            scheduledTime: "08:00",
            disciplineId: "disc-1",
            disciplineName: "Matematica",
            disciplineIcon: "math",
            topicId: "topic-1",
            topicName: "Algebra",
            completed: false,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar um cronograma", async () => {
      const mockResponse = {
        data: {
          generatedItems: 3,
          firstDate: "2026-05-19",
          lastDate: "2026-05-25",
        },
      };

      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await scheduleService.create();

      expect(api.post).toHaveBeenCalledWith(endPoints.schedule.create);
      expect(result).toEqual(mockResponse);
    });

    it("deve delegar erros ao handleApiError", async () => {
      const error = new Error("Network error");
      (api.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(scheduleService.create()).rejects.toThrow("Network error");

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("getWeek", () => {
    it("deve buscar a semana do cronograma", async () => {
      const mockResponse = {
        data: mockWeek,
      };

      (api.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await scheduleService.getWeek("2026-05-19");

      expect(api.get).toHaveBeenCalledWith(endPoints.schedule.week, {
        params: { weekStart: "2026-05-19" },
      });
      expect(result).toEqual(mockWeek);
    });

    it("deve delegar erros ao handleApiError", async () => {
      const error = new Error("Request failed");
      (api.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(scheduleService.getWeek("2026-05-19")).rejects.toThrow("Request failed");

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("completeItem", () => {
    it("deve completar um item do cronograma", async () => {
      const mockResponse = {
        data: {
          itemId: "item-1",
          completed: true,
        },
      };

      (api.patch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await scheduleService.completeItem("item-1", true);

      expect(api.patch).toHaveBeenCalledWith(endPoints.schedule.completeItem("item-1"), {
        completed: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it("deve delegar erros ao handleApiError", async () => {
      const error = new Error("Update failed");
      (api.patch as jest.Mock).mockRejectedValueOnce(error);

      await expect(scheduleService.completeItem("item-1", false)).rejects.toThrow("Update failed");

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });
});
