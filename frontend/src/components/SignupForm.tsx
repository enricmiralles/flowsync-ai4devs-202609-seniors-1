import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ApiFieldError } from "../api/client";
import { ApiError } from "../api/client";

export function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await signup(fullName, email, password, passwordConfirmation);
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
          setFormError(err.fieldErrors[0]?.message ?? "Sign up failed");
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
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.fullName && (
          <p style={{ color: "red", fontSize: "0.875rem" }}>
            {fieldErrors.fullName}
          </p>
        )}
      </div>

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

      <div>
        <label htmlFor="passwordConfirmation">Confirm Password</label>
        <input
          id="passwordConfirmation"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.passwordConfirmation && (
          <p style={{ color: "red", fontSize: "0.875rem" }}>
            {fieldErrors.passwordConfirmation}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
}
