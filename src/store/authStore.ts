import { create } from 'zustand';

interface AuthState {
  user: any; // You should replace 'any' with a proper user type
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));