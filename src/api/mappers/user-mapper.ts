import UserData from "../models/UserData";

export default function mapUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    password: user.password,
    name: user.name,
    surname: user.surname,
  } as UserData;
}
