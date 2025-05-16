import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { getUserData } from "../api/services/userData-service";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import UserData from "../api/models/UserData";
import Cookies from "js-cookie";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const token = useSelector((state: RootState) => state.auth.token); // Ottengo il token dallo stato di Redux tramite useSelector
  const [userData, setUserData] = useState<UserData | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const data = await getUserData(token);
          setUserData(data); // Metto i dati all'interno dello stato userData
        } catch (err) {
          console.error("Errore nel recupero dei dati utente:", err);
        }
      }
    };
    fetchData();
  }, [token]);

  // Se userData non è presente, mostro il messaggio di caricamento della pagina
  if (!userData) return <div>Loading...</div>;

  // Funzione per gestire il logout
  const handleLogout = () => {
    // elimino il token dai cookies
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    // Dispatch dell'azione di logout per aggiornare lo stato globale
    dispatch(logout());
    // reindirizzo alla pagina di login
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Benvenuto, {userData.name} {userData.surname}</h2>
      <p>Email: {userData.email}</p>
      <p>ID: {userData.id}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
