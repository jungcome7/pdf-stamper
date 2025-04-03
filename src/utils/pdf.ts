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
  getDownloadFileName,
  FILE_TYPES,
} from "@/constants";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * 단일 PDF 페이지를 이미지 데이터 URL로 렌더링
 * @param page PDF 페이지 객체
 * @param scale 이미지 스케일 (기본값: PDF_RENDER_SCALE)
 * @returns 렌더링된 페이지의 이미지 데이터 URL
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
 * fabric.js 캔버스를 이미지 데이터 URL로 변환
 * @param canvas fabric.js 캔버스 객체
 * @returns 캔버스의 이미지 데이터 URL
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
 * PDF 파일의 모든 페이지를 이미지로 변환
 * @param file PDF 파일 객체
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
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const pagePromises = pageNumbers.map(async (pageNumber) => {
      const page = await pdf.getPage(pageNumber);
      const imageUrl = await renderPageToImage(page);
      return { pageNumber, imageUrl };
    });

    return await Promise.all(pagePromises);
  } catch {
    return [];
  } finally {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
  }
};

/**
 * Base64 데이터를 바이너리 데이터로 변환
 * @param base64 Base64 형식의 문자열
 * @returns Uint8Array 형식의 바이너리 데이터
 */
const base64ToUint8Array = (base64: string): Uint8Array => {
  const base64Data = base64.includes("data:")
    ? base64.split(",")[1] || base64
    : base64;

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
 * @param stampInstances 추가할 도장 인스턴스 배열
 */
export const generatePdfWithStamps = async (
  originalFile: File,
  stampInstances: StampInstance[]
): Promise<void> => {
  try {
    const arrayBuffer = await originalFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageNumber = i + 1;
      const pageStamps = stampInstances.filter(
        (stamp) => stamp.pageNumber === pageNumber
      );

      if (pageStamps.length === 0) continue;

      const { width, height } = page.getSize();

      // 캔버스와 PDF 사이의 비율 계산
      const scaleX = width / CANVAS_WIDTH;
      const scaleY = height / CANVAS_HEIGHT;

      // 페이지의 각 도장 추가
      for (const stamp of pageStamps) {
        try {
          const stampImageBytes = base64ToUint8Array(stamp.url);
          const stampImage = await pdfDoc.embedPng(stampImageBytes);

          const stampWidth = stampImage.width * stamp.scaleX * scaleX;
          const stampHeight = stampImage.height * stamp.scaleY * scaleY;

          // PDF 좌표계 변환 (왼쪽 하단 원점)
          const stampX = stamp.left * scaleX - stampWidth / 2;
          const stampY = height - stamp.top * scaleY - stampHeight / 2;

          page.drawImage(stampImage, {
            x: stampX,
            y: stampY,
            width: stampWidth,
            height: stampHeight,
          });
        } catch (err) {
          console.error(`페이지 ${pageNumber}의 도장 추가 중 오류:`, err);
        }
      }
    }

    const pdfBytes = await pdfDoc.save({
      useObjectStreams: false,
    });

    const blob = new Blob([pdfBytes], { type: FILE_TYPES.PDF });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getDownloadFileName(originalFile.name);
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF 생성 중 오류 발생:", error);
    throw new Error(
      `PDF 생성 실패: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
