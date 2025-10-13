import type { generateSystemInfo } from "@atechhub/firebase";

// Base entity interface with system fields (managed by mutate function)
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: typeof generateSystemInfo;
  updatedBy?: typeof generateSystemInfo;
}
