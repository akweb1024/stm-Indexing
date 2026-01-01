import { create } from 'zustand';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: string;
  tenantId?: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const getInitialUser = (): AuthUser | null => {
  const saved = localStorage.getItem('user');
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null });
  },
}));