// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ClientIdStore {
  clientId: string;
  setClientId: (id: string) => void;
}

export const useClientIdStore = create<ClientIdStore>()(
  persist(
    (set) => ({
      clientId: '',
      setClientId: (id) => set({ clientId: id }),
    }),
    {
      name: 'client-id-storage',
    }
  )
);
