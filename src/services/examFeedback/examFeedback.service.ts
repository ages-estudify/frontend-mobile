import { SegmentedControlValue } from "@/components/SegmentedControl";
import { ResultGridResponse } from "@/types/exam-feedback.types";
import api, { handleApiError } from "../api";

export async function getExamResultGrid(
  attemptId: string,
  statusFilter?: SegmentedControlValue
): Promise<ResultGridResponse> {
  try {
    const params = statusFilter && statusFilter !== "ALL" ? { statusFilter } : undefined;

    return await api.get<never, ResultGridResponse>(`/exam/${attemptId}/resultGrid`, {
      params,
    });
  } catch (error) {
    throw handleApiError(error);
  }
}
