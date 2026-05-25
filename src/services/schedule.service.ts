import { endPoints } from "@/routes/endpoints";
import type {
  ScheduleCompleteItemResponse,
  ScheduleCreateResponse,
  ScheduleWeek,
  ScheduleWeekResponse,
} from "@/types/schedule.types";
import api, { handleApiError } from "./api";

// type RequestLogPayload = {
//   params?: Record<string, unknown>;
//   data?: Record<string, unknown>;
// };

// const logRequest = (method: string, url: string, payload?: RequestLogPayload) => {
//   if (!__DEV__) return;

//   const safePayload = payload ? JSON.parse(JSON.stringify(payload)) : undefined;
//   console.log("Schedule API request:", {
//     method,
//     url,
//     ...safePayload,
//   });
// };

export const scheduleService = {
  create: async (): Promise<ScheduleCreateResponse> => {
    try {
      // logRequest("POST", endPoints.schedule.create);
      const response: ScheduleCreateResponse = await api.post(endPoints.schedule.create);

      console.log("ScheduleCreateResponse:", response);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getWeek: async (weekStart: string): Promise<ScheduleWeek> => {
    try {
      // logRequest("GET", endPoints.schedule.week, { params: { weekStart } });
      const response: ScheduleWeekResponse = await api.get(endPoints.schedule.week, {
        params: { weekStart },
      });

      console.log("ScheduleWeekResponse:", response);

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
      // logRequest("PATCH", endPoints.schedule.completeItem(itemId), {
      //   data: { completed },
      // });
      const response: ScheduleCompleteItemResponse = await api.patch(
        endPoints.schedule.completeItem(itemId),
        { completed }
      );
      console.log("ScheduleCompleteItemResponse:", response);

      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
