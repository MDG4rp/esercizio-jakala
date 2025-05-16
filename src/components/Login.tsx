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
    setIsLoading(true);

    try {
      const data = await login(email, password);
      console.log("Token JWT:", data.token);
      dispatch(
        loginSuccess({ token: data.token, refreshToken: data.refreshToken })
      );
      Cookies.set("token", data.token, {
        expires: 1, // 1 giorno
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("refreshToken", data.refreshToken, {
        expires: 7, // 7 giorni
        secure: true,
        sameSite: "Strict",
      });
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false); // Riabilito il bottone
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
            disabled={isLoading} //  Disabilito durante il loading
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading} // Disabilito durante il loading
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
