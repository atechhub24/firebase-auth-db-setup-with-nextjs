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
  profilePicture?: string;
  profilePictureFileKey?: string;
}

// Input types for user creation
export interface UserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  status?: UserStatus;
  profilePicture?: string;
  profilePictureFileKey?: string;
}
