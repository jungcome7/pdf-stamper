import { create } from "zustand";
import Stamp1 from "@/assets/stamp-1.jpg";
import { Stamp } from "@/types";

type Store = {
  file: File | null;
  setFile: (file: File | null) => void;
  currentPage: number;
  setCurrentPage: (pageNumber: number) => void;
  requestedPage: number | null;
  setRequestedPage: (pageNumber: number | null) => void;
  isRendering: boolean;
  setIsRendering: (isRendering: boolean) => void;
  stamps: Stamp[];
  addStamp: (stamp: Stamp) => void;
  removeStamp: (id: string) => void;
  selectedStampId: string | null;
  setSelectedStampId: (id: string | null) => void;
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
  stamps: [{ id: "default", url: Stamp1 }],
  addStamp: (stamp: Stamp) =>
    set((state) => ({
      stamps: state.stamps.length < 5 ? [...state.stamps, stamp] : state.stamps,
    })),
  removeStamp: (id: string) =>
    set((state) => ({
      stamps: state.stamps.filter((stamp) => stamp.id !== id),
    })),
  selectedStampId: null,
  setSelectedStampId: (id: string | null) => set({ selectedStampId: id }),
}));
