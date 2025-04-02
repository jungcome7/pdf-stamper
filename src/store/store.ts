import { create } from "zustand";

type Store = {
  file: File | null;
  setFile: (file: File | null) => void;
  currentPage: number;
  setCurrentPage: (pageNumber: number) => void;
  requestedPage: number | null;
  setRequestedPage: (pageNumber: number | null) => void;
  isRendering: boolean;
  setIsRendering: (isRendering: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  file: null,
  setFile: (file: File | null) => set({ file }),
  currentPage: 1,
  setCurrentPage: (pageNumber: number) => set({ currentPage: pageNumber }),
  requestedPage: null,
  setRequestedPage: (pageNumber: number | null) =>
    set({ requestedPage: pageNumber }),
  isRendering: false,
  setIsRendering: (isRendering: boolean) => set({ isRendering }),
}));
