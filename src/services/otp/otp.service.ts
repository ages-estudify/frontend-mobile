// Ajuste a URL base para o endereço real da sua API
// (idealmente via variável de ambiente, ex: process.env.EXPO_PUBLIC_API_URL)
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
    } catch {
      // resposta sem corpo JSON, mantém a mensagem padrão
    }
    throw new Error(message);
  }

  // PATCH /users/update/password e POST /otp/create podem não devolver corpo
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// POST /otp/create
// Sempre retorna sucesso por questão de segurança (não revela se o email existe).
export function createOtp(email: string): Promise<void> {
  return request<void>("/otp/create", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// POST /otp/verify
// Retorna um token (válido por 15 min) se o OTP for válido para o email informado.
export function verifyOtp(email: string, otp: string): Promise<{ token: string }> {
  return request<{ token: string }>("/otp/verify", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

// PATCH /users/update/password
// Só funciona com o token retornado por /otp/verify (não aceita token de login comum).
export function updatePassword(token: string, newPassword: string): Promise<void> {
  return request<void>("/users/update/password", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  });
}
