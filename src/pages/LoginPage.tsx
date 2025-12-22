import { useState } from "react";
//import { Login } from "../components/Login";
import { loginEmail, loginGoogle } from "../services/authService";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await loginEmail(email, password);
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

      <button className="bg-blue-400 rounded p-2 text-amber-50 font-bold" onClick={loginGoogle}>Login with Google</button>

      {error && <p>{error}</p>}
    </div>
  );
};
