import { useState } from "react";
//import { Login } from "../components/Login";
import { loginEmail, loginGoogle } from "../services/authService";
import { useLocation, useNavigate } from "react-router";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location })?.from?.pathname || "/dashboard";

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await loginEmail(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (err as string));
    }
  };

  return (
    <div>
      <form onSubmit={handleEmailLogin}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <hr />

      <button
        className="bg-blue-400 rounded p-2 text-amber-50 font-bold"
        onClick={async () => {
          try {
            await loginGoogle();
            navigate(from, { replace: true });
          } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
          }
        }}
      >
        Login with Google
      </button>

      {error && <p>{error}</p>}
    </div>
  );
};
