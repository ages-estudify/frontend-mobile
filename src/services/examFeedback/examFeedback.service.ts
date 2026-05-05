import { SegmentedControlValue } from "@/components/SegmentedControl";
import { AttemptDayResultResponse, ResultGridResponse } from "@/types/exam-feedback.types";
import api, { handleApiError } from "../api";

export async function getAttemptDayResult(attemptDayId: string): Promise<AttemptDayResultResponse> {
  try {
    return await api.get<never, AttemptDayResultResponse>(`/attempt-days/${attemptDayId}/result`);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getExamResultGrid(
  attemptId: string,
  statusFilter?: SegmentedControlValue
): Promise<ResultGridResponse> {
  try {
    const params =
      statusFilter && statusFilter !== "ALL"
        ? {
            statusFilter,
          }
        : undefined;

    return await api.get<never, ResultGridResponse>(`/exam/${attemptId}/resultGrid`, {
      params,
    });
  } catch (error) {
    throw handleApiError(error);
  }
}
