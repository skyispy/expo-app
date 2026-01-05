import { create } from 'zustand';
import { MenuOption } from '@types';

interface ModalState {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
}

interface EllipsisModalState extends ModalState {
  menuOptions?: MenuOption[];
  setMenuOptions: (options: MenuOption[]) => void;
}
// 더보기 모달
export const useEllipsisModalStore = create<EllipsisModalState>((set) => ({
  isVisible: false,
  show: () => set({ isVisible: true }),
  hide: () => set({ isVisible: false }),
  menuOptions: undefined,
  setMenuOptions: (options) => set({ menuOptions: options }),
}));

interface CategoryModalState extends ModalState {
  channelId?: number;
  setChannelId: (id: number) => void;
  categoryId?: number;
  setCategoryId: (id: number) => void;
  clear: () => void;
}
// 카테고리 모달
export const useCategoryModalStore = create<CategoryModalState>((set) => ({
  isVisible: false,
  show: () => set({ isVisible: true }),
  hide: () => set({ isVisible: false }),
  channelId: undefined,
  setChannelId: (id) => set({ channelId: id }),
  categoryId: undefined,
  setCategoryId: (id) => set({ categoryId: id }),
  clear: () => set({ channelId: undefined, categoryId: undefined }),
}));
