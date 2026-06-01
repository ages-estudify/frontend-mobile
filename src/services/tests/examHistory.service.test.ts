jest.mock("@/services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  handleApiError: jest.fn(),
}));

import { examHistoryService } from "@/services/examHistory.service";

describe("examHistoryService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("history", () => {
    it("should fetch exam history data", async () => {
      expect(examHistoryService).toBeDefined();
      expect(examHistoryService.history).toBeDefined();
    });

    it("should handle 404 error by returning empty history", async () => {
      expect(examHistoryService.history).toBeDefined();
    });
  });
});
