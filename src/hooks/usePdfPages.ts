import { useMemo } from "react";
import { useStore } from "@/store";
import { PageImage } from "@/types";

/**
 * PDF 파일의 페이지를 이미지로 불러오는 커스텀 훅
 * @returns PDF 페이지 이미지 배열
 */
const usePdfPages = (): PageImage[] => {
  const { file, pageImages } = useStore();

  // 파일이 있고 pageImages가 있으면 반환
  // 없으면 빈 배열 반환
  const pages = useMemo(() => {
    if (file && pageImages.length > 0) {
      return pageImages;
    }
    return [];
  }, [file, pageImages]);

  return pages;
};

export default usePdfPages;
