import { useState } from "react";
//import { Login } from "../components/Login";
import { loginEmail, loginGoogle } from "../services/authService";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "../hooks/useTranslation";

export const LoginPage = () => {
  
  const {tr} = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location })?.from?.pathname || "/dashboard";

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    setError(null);

    try {
      await loginEmail(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const isEmailValid = email.includes("@");
  const isPasswordValid = password.length >= 6;

  const getErrorMessage = (err: unknown) => {
    if (!(err instanceof Error)) return "Login failed";

    if (err.message.includes("auth/invalid-credential")) {
      return "Invalid email or password";
    }

    if (err.message.includes("auth/user-not-found")) {
      return "User not found";
    }

    if (err.message.includes("auth/wrong-password")) {
      return "Wrong password";
    }

    return err.message;
  };


  return (
    <div>
      <form onSubmit={handleEmailLogin}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder={tr("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={tr("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button 
          type="submit"
          className="bg-blue-400 rounded p-2 text-amber-50 font-bold"
          disabled={!isEmailValid || !isPasswordValid || submitting}
        >{submitting ? "Loggin in..." : "Login"}</button>
      </form>

      <hr />

      <button
        className="bg-blue-400 rounded p-2 text-amber-50 font-bold"
        onClick={async () => {
          try {
            setSubmitting(true);
            setError(null);
            await loginGoogle();
            navigate(from, { replace: true });
          } catch (err) {
            setError(getErrorMessage(err));
          } finally {
            setSubmitting(false);
          }
        }}
      >
        Login with Google
      </button>

      {error && <p>{error}</p>}
    </div>
  );
};
