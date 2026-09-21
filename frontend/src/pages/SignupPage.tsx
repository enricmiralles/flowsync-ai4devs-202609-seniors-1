import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SignupForm } from "../components/SignupForm";

export function SignupPage() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) return <Navigate to="/" replace />;

  return (
    <main>
      <h1>Sign up</h1>
      <SignupForm />
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}
