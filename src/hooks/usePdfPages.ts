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
  const { file } = useStore();
  const [pages, setPages] = useState<PdfPage[]>([]);

  useEffect(() => {
    if (!file) {
      setPages([]);
      return;
    }

    (async () => {
      try {
        const pagesData = await getPdfPagesAsImages(file);
        setPages(pagesData);
      } catch (error) {
        console.error("페이지 로딩 중 오류 발생:", error);
      }
    })();
  }, [file]);

  return pages;
};

export default usePdfPages;
