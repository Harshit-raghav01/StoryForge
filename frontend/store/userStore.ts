import { create } from 'zustand';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  coinBalance: number;
  authorProfile: {
    penName: string;
    bio: string;
    verified: boolean;
    followers: number;
    earnings: number;
  } | null;
}

interface UserState {
  currentUser: User | null;
  becomeAuthor: (penName: string, bio: string) => void;
  updateBalance: (amount: number) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: {
    _id: 'u1',
    name: 'Ananya Sharma',
    email: 'ananya@example.com',
    avatar: 'https://i.pravatar.cc/150?img=32',
    role: 'user',
    coinBalance: 342,
    authorProfile: null, // Starts as a reader only
  },
  becomeAuthor: (penName, bio) => set((state) => {
    if (!state.currentUser) return state;
    return {
      currentUser: {
        ...state.currentUser,
        authorProfile: {
          penName,
          bio,
          verified: false,
          followers: 0,
          earnings: 0,
        },
      },
    };
  }),
  updateBalance: (amount) => set((state) => {
    if (!state.currentUser) return state;
    return {
      currentUser: {
        ...state.currentUser,
        coinBalance: state.currentUser.coinBalance + amount,
      },
    };
  }),
  logout: () => set({ currentUser: null }),
}));
