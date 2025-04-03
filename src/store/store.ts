import { create } from "zustand";
import Stamp1 from "@/assets/stamp-1.jpg";
import { Stamp, StampInstance } from "@/types";

// 페이지 이미지 타입 정의
type PageImage = {
  pageNumber: number;
  imageUrl: string;
};

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
  stampInstances: StampInstance[];
  addStampInstance: (instance: StampInstance) => void;
  removeStampInstance: (instanceId: string) => void;
  getPageStampInstances: (pageNumber: number) => StampInstance[];
  // 페이지 이미지 관련 상태 및 함수
  pageImages: PageImage[];
  updatePageImage: (pageNumber: number, imageUrl: string) => void;
};

export const useStore = create<Store>((set, get) => ({
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
  // 페이지 이미지 상태 및 업데이트 함수
  pageImages: [],
  updatePageImage: (pageNumber: number, imageUrl: string) =>
    set((state) => ({
      pageImages: [
        ...state.pageImages.filter((page) => page.pageNumber !== pageNumber),
        { pageNumber, imageUrl },
      ],
    })),
}));
