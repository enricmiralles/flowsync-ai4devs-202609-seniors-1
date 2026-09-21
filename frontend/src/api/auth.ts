import { request } from "./client";

export type User = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  initials: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return request<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchProfile(token: string): Promise<User> {
  return request<User>("/api/v1/account/profile", {
    token,
    method: "GET",
  });
}

export async function logout(token: string): Promise<void> {
  try {
    await request<{ message: string }>("/api/v1/account/logout", {
      token,
      method: "POST",
    });
  } catch {
    // Best-effort — swallow errors
  }
}

export async function signup(
  fullName: string,
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<LoginResponse> {
  return request<LoginResponse>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password, passwordConfirmation }),
  });
}
