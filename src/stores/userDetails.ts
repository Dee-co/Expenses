import { create } from "zustand";
import { User } from "@/types/User";

interface UserState {
  userDetail: User | null;
  setUserDetail: (user: User) => void;
  clearUserDetail: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userDetail: null,
  setUserDetail: (user) => {
    set({
      userDetail: user,
    });
  },
  clearUserDetail: () => {
    set({
      userDetail: null,
    });
  },
}));