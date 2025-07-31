export enum Role {
  USER = "user",
  ADMIN = "admin",
  AGENT = "agent",
}
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface ILogin{
  email: string;
  password: string;
}