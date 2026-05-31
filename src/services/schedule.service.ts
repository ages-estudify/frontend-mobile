import { endPoints } from "@/routes/endpoints";
import type {
  ScheduleCompleteItemResponse,
  ScheduleCreateResponse,
  ScheduleWeek,
  ScheduleWeekResponse,
} from "@/types/schedule.types";
import api, { handleApiError } from "./api";

export const scheduleService = {
  create: async (): Promise<ScheduleCreateResponse> => {
    try {
      const response: ScheduleCreateResponse = await api.post(endPoints.schedule.create);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getWeek: async (weekStart: string): Promise<ScheduleWeek> => {
    try {
      const response: ScheduleWeekResponse = await api.get(endPoints.schedule.week, {
        params: { weekStart },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  completeItem: async (
    itemId: string,
    completed: boolean
  ): Promise<ScheduleCompleteItemResponse> => {
    try {
      const response: ScheduleCompleteItemResponse = await api.patch(
        endPoints.schedule.completeItem(itemId),
        { completed }
      );
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
