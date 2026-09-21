import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) return <Navigate to="/" replace />;

  return (
    <main>
      <h1>Login</h1>
      <LoginForm />
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </main>
  );
}
