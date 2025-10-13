import { BaseEntity } from "./common.type";

// Status types
export type Status = "active" | "inactive";
export type UserStatus = "active" | "inactive" | "pending";
export type UserRole = "admin" | "staff";

export interface User extends BaseEntity {
  uid: string;
  name: string;
  email: string;
  status: UserStatus;
  password: string;
  role: UserRole;
}
