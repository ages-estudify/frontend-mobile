export type PlanType = "TRIMESTRAL" | "ANUAL";

export interface SubscriptionRequest {
  planType: PlanType;
}

export interface SubscriptionResponse {
  success: boolean;
  data: {
    planActive: boolean;
    planExpirationDate: string;
    token: string;
    refreshToken: string;
  };
}
