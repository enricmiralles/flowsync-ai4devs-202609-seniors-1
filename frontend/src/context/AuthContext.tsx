import { createContext, useState, useEffect, type ReactNode } from "react";
import {
  login as apiLogin,
  signup as apiSignup,
  fetchProfile,
  logout as apiLogout,
  type User,
} from "../api/auth";

export type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    fullName: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    fetchProfile(storedToken)
      .then((u) => {
        setUser(u);
        setToken(storedToken);
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function handleLogin(email: string, password: string) {
    const { user: newUser, token: newToken } = await apiLogin(email, password);
    localStorage.setItem("token", newToken);
    setUser(newUser);
    setToken(newToken);
  }

  async function handleSignup(
    fullName: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) {
    const { user: newUser, token: newToken } = await apiSignup(
      fullName,
      email,
      password,
      passwordConfirmation,
    );
    localStorage.setItem("token", newToken);
    setUser(newUser);
    setToken(newToken);
  }

  async function handleLogout() {
    if (token) {
      await apiLogout(token);
    }
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
