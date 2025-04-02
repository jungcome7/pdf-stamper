import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { getImageByFile } from "@/utils";

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
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!file || !canvasRef.current) return;

    setIsLoading(true);
    setError(null);

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
      setIsLoading(false);
      return;
    }

    const renderPdfToCanvas = async () => {
      try {
        const imageDataUrl = await getImageByFile(file);

        if (!imageDataUrl) {
          setError({ message: "PDF 파일을 이미지로 변환하는데 실패했습니다." });
          setIsLoading(false);
          return;
        }

        if (!fabricCanvasRef.current) {
          setError({ message: "캔버스가 준비되지 않았습니다." });
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

    renderPdfToCanvas();

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
      setIsLoading(false);
      setError(null);
    };
  }, [file, canvasRef]);

  return { fabricCanvasRef, error, isLoading };
};

export default useRenderPdfToCanvas;
