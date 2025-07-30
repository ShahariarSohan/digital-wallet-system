export enum Role {
  USER = "user",
  ADMIN = "admin",
  AGENT = "agent",
}
export enum Status{
  PENDING = "pending",
  APPROVED = "approved",
  SUSPENDED="suspended"  
}
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}
