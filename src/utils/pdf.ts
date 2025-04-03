import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";
import * as fabric from "fabric";
import { PDFDocument } from "pdf-lib";
import { StampInstance } from "@/types";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PDF_RENDER_SCALE,
  PDF_IMAGE_QUALITY,
  DOWNLOAD_FILE_PREFIX,
  FILE_TYPES,
} from "@/constants";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * 단일 PDF 페이지를 이미지 데이터 URL로 렌더링
 * @param page PDF 페이지 객체
 * @param scale 이미지 스케일 (기본값: 2)
 * @returns 이미지 데이터 URL
 */
export const renderPageToImage = async (
  page: pdfjsLib.PDFPageProxy,
  scale: number = PDF_RENDER_SCALE
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
      quality: PDF_IMAGE_QUALITY.QUALITY,
      multiplier: PDF_IMAGE_QUALITY.MULTIPLIER,
    });
  } catch (error) {
    console.error("캔버스 이미지 생성 실패:", error);
    return "";
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

/**
 * Base64 데이터를 바이너리 데이터로 변환
 * @param base64 Base64 문자열
 * @returns Uint8Array 바이너리 데이터
 */
const base64ToUint8Array = (base64: string): Uint8Array => {
  // 데이터 URL 형식인 경우 Base64 부분만 추출
  const base64Data = base64.includes("data:")
    ? base64.split(",")[1] || base64
    : base64;

  // Base64 디코딩
  try {
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error(
      "Base64 디코딩 오류:",
      error,
      "원본 데이터:",
      base64.substring(0, 100) + "..."
    );
    throw new Error("이미지 데이터 변환에 실패했습니다.");
  }
};

/**
 * 도장이 추가된 PDF 파일 생성 및 다운로드
 * @param originalFile 원본 PDF 파일
 * @param stampInstances 도장 인스턴스 배열
 */
export const generatePdfWithStamps = async (
  originalFile: File,
  stampInstances: StampInstance[]
): Promise<void> => {
  try {
    // 원본 PDF 파일을 ArrayBuffer로 변환
    const arrayBuffer = await originalFile.arrayBuffer();

    // PDF 문서 로드
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    // fabricCanvas 크기
    const FABRIC_CANVAS_WIDTH = CANVAS_WIDTH;
    const FABRIC_CANVAS_HEIGHT = CANVAS_HEIGHT;

    // 페이지별로 도장 추가
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageNumber = i + 1;
      const pageStamps = stampInstances.filter(
        (stamp) => stamp.pageNumber === pageNumber
      );

      if (pageStamps.length === 0) continue;

      // 페이지 크기 가져오기
      const { width, height } = page.getSize();

      // 스케일 비율 계산 (fabric canvas -> PDF 좌표)
      const scaleX = width / FABRIC_CANVAS_WIDTH;
      const scaleY = height / FABRIC_CANVAS_HEIGHT;

      // 각 도장 추가
      for (const stamp of pageStamps) {
        try {
          // 이미지 데이터 변환
          const stampImageBytes = base64ToUint8Array(stamp.url);

          // 이미지 임베드
          const stampImage = await pdfDoc.embedPng(stampImageBytes);

          // 도장 위치 계산 (fabric.js 좌표를 PDF 좌표로 변환)
          // 비율에 맞게 스케일 조정
          const stampLeft = stamp.left * scaleX;
          const stampTop = stamp.top * scaleY;
          const stampWidth = stampImage.width * stamp.scaleX * scaleX;
          const stampHeight = stampImage.height * stamp.scaleY * scaleY;

          // PDF 좌표계 (왼쪽 하단 원점)에 맞게 y좌표 변환
          const stampX = stampLeft - stampWidth / 2;
          const stampY = height - stampTop - stampHeight / 2;

          // 도장 그리기
          page.drawImage(stampImage, {
            x: stampX,
            y: stampY,
            width: stampWidth,
            height: stampHeight,
          });
        } catch (err) {
          console.error(`페이지 ${pageNumber}의 도장 추가 중 오류:`, err);
          // 개별 도장 오류는 무시하고 다른 도장 처리 계속
        }
      }
    }

    // PDF 저장 (고품질)
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: false, // 더 좋은 호환성
    });

    // 다운로드 링크 생성 및 클릭
    const blob = new Blob([pdfBytes], { type: FILE_TYPES.PDF });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${DOWNLOAD_FILE_PREFIX}${originalFile.name}`;
    link.click();

    // 자원 해제
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF 생성 중 오류 발생:", error);
    throw new Error(
      `PDF 생성 실패: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
