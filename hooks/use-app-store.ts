import { create } from "zustand";
import type { User } from "@/lib/types/user.type";

interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
