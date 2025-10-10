import { create } from 'zustand';

type MenuOption = {
  icon: string;
  label: string;
  action: () => void;
}

type EllipsisModalState = {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  menuOptions?: MenuOption[];
  setMenuOptions: (options: MenuOption[]) => void;
}

export const useEllipsisModalStore = create<EllipsisModalState>((set) => ({
  isVisible: false,
  show: () => set({ isVisible: true }),
  hide: () => set({ isVisible: false }),
  menuOptions: undefined,
  setMenuOptions: (options) => set({ menuOptions: options })
}));