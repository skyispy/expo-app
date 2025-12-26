import { create } from 'zustand';

interface CommentInputStore {
  mode: 'create' | 'edit' | 'reply';
  setMode: (mode: 'create' | 'edit' | 'reply') => void;
  value: string;
  setValue: (value: string) => void;
  targetType?: string;
  setTargetType: (type: string) => void;
  targetId?: number;
  setTargetId: (id: number) => void;
  parentCommentId?: number;
  setParentCommentId: (id: number) => void;
  commentId?: number;
  setCommentId: (id: number) => void;
  headerText?: string;
  setHeaderText: (text: string) => void;
  clear: () => void;
}

export const useCommentInputStore = create<CommentInputStore>((set) => ({
  mode: 'create',
  setMode: (mode) => set({ mode }),
  value: '',
  setValue: (value) => set({ value }),
  targetType: undefined,
  setTargetType: (type) => set({ targetType: type }),
  targetId: undefined,
  setTargetId: (id) => set({ targetId: id }),
  parentCommentId: undefined,
  setParentCommentId: (id) => set({ parentCommentId: id }),
  commentId: undefined,
  setCommentId: (id) => set({ commentId: id }),
  headerText: undefined,
  setHeaderText: (text) => set({ headerText: text }),
  clear: () =>
    set({
      mode: 'create',
      value: '',
      parentCommentId: undefined,
      headerText: undefined,
    }),
}));
