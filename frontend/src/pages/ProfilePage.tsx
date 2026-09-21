import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <main>
      <h1>Profile</h1>
      {user && (
        <>
          <p>
            <strong>Initials:</strong> {user.initials}
          </p>
          <p>
            <strong>Name:</strong> {user.fullName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </>
      )}
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}
