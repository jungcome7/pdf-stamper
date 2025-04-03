import { Stamp, StampInstance, PageImage } from "./index";

export interface Store {
  file: File | null;
  setFile: (file: File | null) => void;
  currentPage: number;
  setCurrentPage: (pageNumber: number) => void;
  stamps: Stamp[];
  addStamp: (stamp: Stamp) => void;
  removeStamp: (id: string) => void;
  selectedStampId: string | null;
  setSelectedStampId: (id: string | null) => void;
  stampInstances: StampInstance[];
  addStampInstance: (instance: StampInstance) => void;
  removeStampInstance: (instanceId: string) => void;
  getPageStampInstances: (pageNumber: number) => StampInstance[];
  pageImages: PageImage[];
  updatePageImage: (pageNumber: number, imageUrl: string) => void;
}
