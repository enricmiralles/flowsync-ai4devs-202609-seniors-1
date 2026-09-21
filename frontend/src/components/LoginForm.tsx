import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ApiFieldError } from "../api/client";
import { ApiError } from "../api/client";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422) {
          const errors: Record<string, string> = {};
          err.fieldErrors.forEach((fe: ApiFieldError) => {
            if (fe.field) {
              errors[fe.field] = fe.message;
            }
          });
          setFieldErrors(errors);
        } else {
          setFormError(err.fieldErrors[0]?.message ?? "Login failed");
        }
      } else {
        setFormError("Unexpected error, please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {formError && <div style={{ color: "red" }}>{formError}</div>}

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.email && (
          <p style={{ color: "red", fontSize: "0.875rem" }}>
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.password && (
          <p style={{ color: "red", fontSize: "0.875rem" }}>
            {fieldErrors.password}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
