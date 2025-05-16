import axios from "axios";
import UserData from "../models/UserData";
import mapUser from "../mappers/user-mapper";

export const getUserData = (token: string): Promise<UserData> => {
  return axios
    .get("https://run.mocky.io/v3/20ec8886-ab6e-4141-b8ff-a05d93b0d44e", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const mappedUser = mapUser(response.data);
      return {
        id: mappedUser.id,
        email: mappedUser.email,
        password: mappedUser.password, // la metto giusto perché il backend la manda al client, altrimenti non andrebbe fatto
        name: mappedUser.name,
        surname: mappedUser.surname,
      };
    })
    .catch(() => {
      throw new Error("Token non valido. Riprova.");
    });
};
