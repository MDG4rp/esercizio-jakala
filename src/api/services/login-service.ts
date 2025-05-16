import axios from "axios";
import mapToken from "../mappers/token-mapper";

export const login = (email: string, password: string) => {
  return axios
    .post("https://run.mocky.io/v3/8d1199c0-d333-482e-87c1-78ee85010b8e", {
      email,
      password,
    })
    .then((response) => {
      const mappedResponse = mapToken(response.data);
      return {
        token: mappedResponse.token,
        refreshToken: mappedResponse.refreshToken,
      };
    })
    .catch(() => {
      throw new Error("Credenziali non valide. Riprova.");
    });
};
