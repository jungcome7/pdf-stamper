import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";
import * as fabric from "fabric";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * 단일 PDF 페이지를 이미지 데이터 URL로 렌더링
 * @param page PDF 페이지 객체
 * @param scale 이미지 스케일 (기본값: 2)
 * @returns 이미지 데이터 URL
 */
export const renderPageToImage = async (
  page: pdfjsLib.PDFPageProxy,
  scale: number = 2
): Promise<string> => {
  try {
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("캔버스 컨텍스트를 생성할 수 없습니다");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
    return canvas.toDataURL("image/png");
  } catch (error) {
    throw new Error(
      `PDF 페이지 렌더링 실패: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

/**
 * fabric.js 캔버스를 이미지 데이터 URL로 변환 (도장이 찍힌 페이지 이미지용)
 * @param canvas fabric.js 캔버스 객체
 * @returns 이미지 데이터 URL
 */
export const createStampedPageImage = (canvas: fabric.Canvas): string => {
  try {
    return canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 0.5, // 미리보기용이므로 성능을 위해 크기 감소
    });
  } catch (error) {
    console.error("캔버스 이미지 생성 실패:", error);
    return "";
  }
};

export const pdfFileToImage = async (
  file: File
): Promise<{
  image: string;
  error: string | null;
  fileName: string;
}> => {
  let pdfUrl = "";

  try {
    pdfUrl = URL.createObjectURL(file);
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

    const renderPageToImage = async (): Promise<string> => {
      try {
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("캔버스 컨텍스트를 생성할 수 없습니다");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        return canvas.toDataURL("image/png");
      } catch (error) {
        throw new Error(
          `PDF 페이지 렌더링 실패: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    };

    return {
      image: await renderPageToImage(),
      error: null,
      fileName: file.name,
    };
  } catch (error) {
    return {
      image: "",
      error: `PDF 변환 실패: ${
        error instanceof Error ? error.message : String(error)
      }`,
      fileName: file.name,
    };
  } finally {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
  }
};

export const getImageByFile = async (file: File): Promise<string | null> => {
  try {
    const result = await pdfFileToImage(file);
    return result.error ? null : result.image;
  } catch {
    return null;
  }
};

/**
 * PDF 파일의 모든 페이지를 이미지로 변환 (병렬 처리)
 * @param file PDF 파일
 * @returns 페이지 번호와 이미지 URL이 포함된 객체 배열
 */
export const getPdfPagesAsImages = async (
  file: File
): Promise<{ pageNumber: number; imageUrl: string }[]> => {
  let pdfUrl = "";

  try {
    pdfUrl = URL.createObjectURL(file);
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const totalPages = pdf.numPages;

    // 모든 페이지 번호 배열 생성
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Promise.all을 사용해 모든 페이지를 병렬로 처리
    const pagePromises = pageNumbers.map(async (pageNumber) => {
      const page = await pdf.getPage(pageNumber);
      const imageUrl = await renderPageToImage(page);
      return { pageNumber, imageUrl };
    });

    // 모든 페이지 처리 완료 대기
    const results = await Promise.all(pagePromises);

    return results;
  } catch {
    // 조용히 빈 배열 반환
    return [];
  } finally {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
  }
};
