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
  statusFilter?: SegmentedControlValue,
  attemptDayId?: string
): Promise<ResultGridResponse> {
  try {
    const params: Record<string, string> = {};
    if (statusFilter && statusFilter !== "ALL") params.statusFilter = statusFilter;
    if (attemptDayId) params.attemptDayId = attemptDayId;

    return await api.get<never, ResultGridResponse>(`/exams/${attemptId}/resultGrid`, {
      params: Object.keys(params).length > 0 ? params : undefined,
    });
  } catch (error) {
    throw handleApiError(error);
  }
}
