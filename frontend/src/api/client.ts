export type ApiFieldError = {
  message: string;
  rule?: string;
  field?: string;
};

export class ApiError extends Error {
  status: number;
  fieldErrors: ApiFieldError[];

  constructor(status: number, fieldErrors: ApiFieldError[]) {
    super(fieldErrors[0]?.message ?? `API error: ${status}`);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (fetchOptions.headers instanceof Headers) {
    fetchOptions.headers.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (fetchOptions.headers && typeof fetchOptions.headers === "object") {
    Object.assign(headers, fetchOptions.headers);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const data = await response.json();
    const errors = data.errors || [];
    throw new ApiError(response.status, errors);
  }

  return response.json() as Promise<T>;
}
