import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { getPdfPagesAsImages } from "@/utils";
import { useStore } from "@/store";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/constants";
import { PageImage } from "@/types";

/**
 * PDF 파일을 캔버스에 렌더링하는 커스텀 훅
 * @param file PDF 파일 객체 또는 null
 * @param canvasRef 캔버스 DOM 요소에 대한 ref
 * @returns fabricCanvasRef, error, isLoading 상태를 포함하는 객체
 */
const useRenderPdfToCanvas = (
  file: File | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
  const { currentPage } = useStore();
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<PageImage[]>([]);

  /**
   * PDF 파일이 변경될 때 모든 페이지를 이미지로 변환
   */
  useEffect(() => {
    if (!file) {
      setPages([]);
      return;
    }

    setIsLoading(true);

    const loadPages = async () => {
      try {
        const pagesData = await getPdfPagesAsImages(file);
        setPages(pagesData);
        setIsLoading(false);
      } catch {
        setError({
          message: "PDF 페이지를 불러오는 중 오류가 발생했습니다.",
        });
        setIsLoading(false);
      }
    };

    loadPages();
  }, [file]);

  /**
   * 페이지 변경 또는 PDF 로드 시 현재 페이지를 캔버스에 렌더링
   */
  useEffect(() => {
    if (!file || !canvasRef.current || pages.length === 0) return;

    setIsLoading(true);
    setError(null);

    const currentPageData = pages.find(
      (page) => page.pageNumber === currentPage
    );
    if (!currentPageData) {
      setIsLoading(false);
      return;
    }

    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    try {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        selection: false,
      });
    } catch {
      setError({ message: "캔버스를 초기화하는 중 오류가 발생했습니다." });
      setIsLoading(false);
      return;
    }

    const renderImageToCanvas = async () => {
      try {
        const imageDataUrl = currentPageData.imageUrl;

        if (!imageDataUrl || !fabricCanvasRef.current) {
          setError({ message: "이미지 데이터를 찾을 수 없습니다." });
          setIsLoading(false);
          return;
        }

        const imgElement = new Image();
        imgElement.crossOrigin = "anonymous";
        imgElement.src = imageDataUrl;

        imgElement.onload = () => {
          if (!fabricCanvasRef.current) {
            setError({ message: "캔버스가 준비되지 않았습니다." });
            setIsLoading(false);
            return;
          }

          try {
            const fabricImage = new fabric.FabricImage(imgElement);

            const scale = Math.min(
              CANVAS_WIDTH / imgElement.width,
              CANVAS_HEIGHT / imgElement.height
            );

            fabricImage.scale(scale);
            fabricImage.set({
              left: CANVAS_WIDTH / 2,
              top: CANVAS_HEIGHT / 2,
              originX: "center",
              originY: "center",
              objectCaching: false,
            });

            fabricCanvasRef.current.backgroundImage = fabricImage;
            fabricCanvasRef.current.renderAll();
            setIsLoading(false);
          } catch {
            setError({
              message: "이미지를 캔버스에 표시하는 중 오류가 발생했습니다.",
            });
            setIsLoading(false);
          }
        };

        imgElement.onerror = () => {
          setError({ message: "이미지 로딩 중 오류가 발생했습니다." });
          setIsLoading(false);
        };
      } catch {
        setError({ message: "PDF 렌더링 중 오류가 발생했습니다." });
        setIsLoading(false);
      }
    };

    renderImageToCanvas();

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [file, canvasRef, currentPage, pages]);

  return { fabricCanvasRef, error, isLoading };
};

export default useRenderPdfToCanvas;
