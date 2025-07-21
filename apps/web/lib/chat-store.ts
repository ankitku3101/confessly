import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum Feeling {
  Happy = 'happy',
  Neutral = 'neutral',
  Sad = 'sad',
}

interface ChatState {
  username: string;
  hasJoined: boolean;
  room: string;
  feeling: Feeling;
  setUsername: (username: string) => void;
  setHasJoined: (joined: boolean) => void;
  setRoom: (room: string) => void;
  setFeeling: (feeling: Feeling) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      username: '',
      hasJoined: false,
      room: '',
      feeling: Feeling.Neutral,
      setUsername: (username) => set({ username }),
      setHasJoined: (hasJoined) => set({ hasJoined }),
      setRoom: (room) => set({ room }),
      setFeeling: (feeling) => set({ feeling }),
      reset: () =>
        set({
          username: '',
          hasJoined: false,
          room: '',
          feeling: Feeling.Neutral,
        }),
    }),
    {
      name: 'chat-storage', 
      partialize: (state) => ({
        username: state.username,
        hasJoined: state.hasJoined,
        room: state.room,
        feeling: state.feeling,
      }),
    }
  )
);
