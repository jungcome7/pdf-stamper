import { create } from "zustand";
import { Stamp, StampInstance, Store } from "@/types";
import { MAX_STAMPS } from "@/constants";

export const useStore = create<Store>((set, get) => ({
  file: null,
  setFile: (file: File | null) => set({ file }),
  currentPage: 1,
  setCurrentPage: (pageNumber: number) => set({ currentPage: pageNumber }),
  stamps: [],
  addStamp: (stamp: Stamp) =>
    set((state) => ({
      stamps:
        state.stamps.length < MAX_STAMPS
          ? [...state.stamps, stamp]
          : state.stamps,
    })),
  removeStamp: (id: string) =>
    set((state) => ({
      stamps: state.stamps.filter((stamp) => stamp.id !== id),
    })),
  selectedStampId: null,
  setSelectedStampId: (id: string | null) => set({ selectedStampId: id }),
  stampInstances: [],
  addStampInstance: (instance: StampInstance) =>
    set((state) => ({
      stampInstances: [...state.stampInstances, instance],
    })),
  removeStampInstance: (instanceId: string) =>
    set((state) => ({
      stampInstances: state.stampInstances.filter(
        (instance) => instance.id !== instanceId
      ),
    })),
  getPageStampInstances: (pageNumber: number) => {
    return get().stampInstances.filter(
      (instance) => instance.pageNumber === pageNumber
    );
  },
  pageImages: [],
  updatePageImage: (pageNumber: number, imageUrl: string) =>
    set((state) => ({
      pageImages: [
        ...state.pageImages.filter((page) => page.pageNumber !== pageNumber),
        { pageNumber, imageUrl },
      ],
    })),
}));
