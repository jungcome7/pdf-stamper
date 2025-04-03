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

  // 최초 PDF 파일 로딩 시 페이지 이미지 생성
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

  // pageImages에 변경이 있을 때 해당 페이지 이미지 업데이트
  useEffect(() => {
    if (pageImages.length === 0 || pages.length === 0) return;

    // 도장이 찍힌 페이지 이미지로 업데이트
    setPages((prevPages) => {
      return prevPages.map((page) => {
        // 해당 페이지의 업데이트된 이미지가 있는지 확인
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
