import { create } from 'zustand';

type SessionState = {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
}));
