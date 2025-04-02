import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { getPdfPagesAsImages } from "@/utils";
import { useStore } from "@/store";

// A4 비율로 캔버스 크기 지정 (가로:세로 = 1:√2)
const FABRIC_CANVAS_WIDTH = 500;
const FABRIC_CANVAS_HEIGHT = parseFloat(
  (FABRIC_CANVAS_WIDTH * Math.sqrt(2)).toFixed(2)
);

/**
 * PDF 파일을 캔버스에 렌더링하는 커스텀 훅
 * @param file PDF 파일
 * @param canvasRef 캔버스 엘리먼트 ref
 * @returns 캔버스 참조와 오류 상태
 */
const useRenderPdfToCanvas = (
  file: File | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
  const { currentPage } = useStore();
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<
    { pageNumber: number; imageUrl: string }[]
  >([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // PDF 페이지 가져오기
  useEffect(() => {
    if (!file) {
      setPages([]);
      return;
    }

    setIsLoading(true);
    let isMounted = true;

    const loadPages = async () => {
      try {
        const pagesData = await getPdfPagesAsImages(file);
        if (isMounted) {
          setPages(pagesData);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setError({
            message: "PDF 페이지를 불러오는 중 오류가 발생했습니다.",
          });
          setIsLoading(false);
        }
      }
    };

    loadPages();

    return () => {
      isMounted = false;
    };
  }, [file]);

  // 캔버스에 현재 페이지 렌더링
  useEffect(() => {
    if (!file || !canvasRef.current || pages.length === 0) return;

    const currentPageData = pages.find(
      (page) => page.pageNumber === currentPage
    );
    if (!currentPageData) return;

    // 첫 로딩 이후에는 페이지 전환 시 로딩 표시 안함
    if (!isInitialLoad) {
      setError(null);
    } else {
      setIsInitialLoad(false);
    }

    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    try {
      // 캔버스 초기화
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: FABRIC_CANVAS_WIDTH,
        height: FABRIC_CANVAS_HEIGHT,
        selection: false,
      });
    } catch {
      setError({ message: "캔버스를 초기화하는 중 오류가 발생했습니다." });
      return;
    }

    const renderImageToCanvas = async () => {
      try {
        const imageDataUrl = currentPageData.imageUrl;

        if (!imageDataUrl || !fabricCanvasRef.current) {
          setError({ message: "이미지 데이터를 찾을 수 없습니다." });
          return;
        }

        const imgElement = new Image();
        imgElement.crossOrigin = "anonymous";
        imgElement.src = imageDataUrl;

        imgElement.onload = () => {
          if (!fabricCanvasRef.current) {
            setError({ message: "캔버스가 준비되지 않았습니다." });
            return;
          }

          try {
            const fabricImage = new fabric.FabricImage(imgElement);

            // 캔버스 크기에 맞게 이미지 비율 계산
            const scale = Math.min(
              FABRIC_CANVAS_WIDTH / imgElement.width,
              FABRIC_CANVAS_HEIGHT / imgElement.height
            );

            // 이미지 스케일 및 위치 설정
            fabricImage.scale(scale);
            fabricImage.set({
              left: FABRIC_CANVAS_WIDTH / 2,
              top: FABRIC_CANVAS_HEIGHT / 2,
              originX: "center",
              originY: "center",
              objectCaching: false,
            });

            // 캔버스에 이미지 표시
            fabricCanvasRef.current.backgroundImage = fabricImage;
            fabricCanvasRef.current.renderAll();
            setIsLoading(false);
          } catch {
            setError({
              message: "이미지를 캔버스에 표시하는 중 오류가 발생했습니다.",
            });
          }
        };

        imgElement.onerror = () => {
          setError({ message: "이미지 로딩 중 오류가 발생했습니다." });
        };
      } catch {
        setError({ message: "PDF 렌더링 중 오류가 발생했습니다." });
      }
    };

    renderImageToCanvas();

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [file, canvasRef, currentPage, pages, isInitialLoad]);

  return { fabricCanvasRef, error, isLoading };
};

export default useRenderPdfToCanvas;
