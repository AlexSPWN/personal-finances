import { loginGoogle } from "../services/authService";

export const Login = () => {
  const loginWithGoogle = async () => {
    try {
      await loginGoogle();
      alert("Logged in with Google");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button onClick={loginWithGoogle}>
      Login with Google
    </button>
  );
};
