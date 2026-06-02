import { endPoints } from "@/routes/endpoints";
import type { SubscriptionRequest, SubscriptionResponse } from "@/types/subscription.types";
import api, { handleApiError } from "../api";

export const subscriptionService = {
  subscribe: async (body: SubscriptionRequest): Promise<SubscriptionResponse> => {
    try {
      const response: SubscriptionResponse = await api.post(endPoints.subscriptions.create, body);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
