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
    slug?: string;
    bio: string;
    verified: boolean;
    followers: number;
    earnings: number;
    profileCompleted?: boolean;
  } | null;
}

interface UserState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  becomeAuthor: (penName: string, bio: string, slug?: string, profileCompleted?: boolean) => void;
  updateBalance: (amount: number) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  becomeAuthor: (penName, bio, slug, profileCompleted) => set((state) => {
    if (!state.currentUser) return state;
    return {
      currentUser: {
        ...state.currentUser,
        authorProfile: {
          penName,
          slug,
          bio,
          verified: false,
          followers: 0,
          earnings: 0,
          profileCompleted: profileCompleted ?? false,
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
