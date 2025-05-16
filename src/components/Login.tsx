import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import "../styles/Login.css";
import { login } from "../api/services/login-service";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Tutti i campi sono obbligatori.");
      return;
    }
    if (!email.includes("@")) {
      setError("Email non valida.");
      return;
    }
    if (password.length < 6) {
      setError("La password deve essere di almeno 6 caratteri.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await login(email, password);
      dispatch(
        loginSuccess({ token: data.token, refreshToken: data.refreshToken })
      );

      Cookies.set("token", data.token, {
        expires: 1, // scade dopo 1 giorno
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("refreshToken", data.refreshToken, {
        expires: 7, // scade dopo una settimana
        secure: true,
        sameSite: "Strict",
      });

      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Accedi</h2>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Caricamento..." : "Login"}
        </button>
      </form>
    </div>
  );
}
