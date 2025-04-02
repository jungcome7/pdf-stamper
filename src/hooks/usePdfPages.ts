import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { getPdfPagesAsImages } from "@/utils";

type PdfPage = {
  pageNumber: number;
  imageUrl: string;
};

/**
 * PDF 파일의 페이지를 이미지로 불러오는 커스텀 훅
 * @returns PDF 페이지 이미지 배열
 */
const usePdfPages = () => {
  const { file, currentPage, setCurrentPage } = useStore();
  const [pages, setPages] = useState<PdfPage[]>([]);

  useEffect(() => {
    if (!file) {
      setPages([]);
      return;
    }

    (async () => {
      const pagesData = await getPdfPagesAsImages(file);
      setPages(pagesData);
      // 페이지 로드 완료 후 첫 번째 페이지 선택
      if (pagesData.length > 0 && currentPage > pagesData.length) {
        setCurrentPage(1);
      }
    })();
  }, [file, currentPage, setCurrentPage]);

  return pages;
};

export default usePdfPages;
