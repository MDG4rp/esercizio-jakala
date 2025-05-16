import Tokens from "../models/Tokens";

export default function mapToken(tokens: any) {
  return {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
  } as Tokens;
}
