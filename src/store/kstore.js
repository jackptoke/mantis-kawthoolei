import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // fishes: 0,
      // addAFish: () => set({ fishes: get().fishes + 1 }),
      townships: [],
      setTownship: (newTownships) => set({ townships: newTownships })
    }),
    {
      name: 'kstore', // unique name
      getStorage: () => sessionStorage // (optional) by default the 'localStorage' is used
    }
  )
);
