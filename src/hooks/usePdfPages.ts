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
  const { file, pageImages } = useStore();
  const [pages, setPages] = useState<PdfPage[]>([]);

  /**
   * PDF 파일이 변경될 때 각 페이지를 이미지로 변환하여 상태 업데이트
   */
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

  /**
   * pageImages가 변경될 때 해당하는 페이지의 이미지 URL 업데이트
   */
  useEffect(() => {
    if (pageImages.length === 0 || pages.length === 0) return;

    setPages((prevPages) => {
      return prevPages.map((page) => {
        const updatedPage = pageImages.find(
          (p) => p.pageNumber === page.pageNumber
        );
        if (updatedPage) {
          return { ...page, imageUrl: updatedPage.imageUrl };
        }
        return page;
      });
    });
  }, [pageImages, pages.length]);

  return pages;
};

export default usePdfPages;
