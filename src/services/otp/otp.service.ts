const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://SUA_API_AQUI.com";

type ApiErrorResponse = {
  message?: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = "Não foi possível completar a solicitação";
    try {
      const data = (await response.json()) as ApiErrorResponse;
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function createOtp(email: string): Promise<void> {
  return request<void>("/otp/create", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyOtp(email: string, otp: string): Promise<{ token: string }> {
  return request<{ token: string }>("/otp/verify", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export function updatePassword(token: string, newPassword: string): Promise<void> {
  return request<void>("/users/update/password", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  });
}
