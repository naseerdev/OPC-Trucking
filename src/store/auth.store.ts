import { create } from 'zustand';

import type { User, Credentials } from '../types/global';

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (credentials) => {
    // Implementation
    set({ isAuthenticated: false, user: null });
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));
