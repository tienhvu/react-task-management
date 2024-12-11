import { User } from "./User";

export type RegisterUser = Omit<User, "id" | "createdAt" | "updatedAt">;
