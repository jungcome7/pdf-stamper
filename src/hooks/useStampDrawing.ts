import { RefObject, useCallback } from "react";
import * as fabric from "fabric";
import { useStore } from "@/store";

const useStampDrawing = (fabricCanvasRef: RefObject<fabric.Canvas | null>) => {
  const { stamps, selectedStampId } = useStore();

  /**
   * 선택된 도장을 캔버스에 추가하는 함수
   */
  const addStampToCanvas = useCallback(() => {
    if (!fabricCanvasRef.current || !selectedStampId) {
      return;
    }

    try {
      const selectedStamp = stamps.find(
        (stamp) => stamp.id === selectedStampId
      );

      if (!selectedStamp) {
        return;
      }

      const canvas = fabricCanvasRef.current;

      // 이미지 생성 및 로드 - HTMLImageElement를 직접 생성하는 방식 사용
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = selectedStamp.url;

      img.onload = () => {
        // 캔버스 크기 계산
        const canvasWidth = canvas.width || 500;
        const canvasHeight = canvas.height || 707;

        // 도장의 크기를 캔버스 대비 상대적으로 설정
        const maxWidthPercent = 0.1; // 캔버스 너비의 10%
        const maxHeightPercent = 0.1; // 캔버스 높이의 10%

        const maxWidth = canvasWidth * maxWidthPercent;
        const maxHeight = canvasHeight * maxHeightPercent;

        // 이미지 비율 유지하며 크기 계산
        const imgWidth = img.width;
        const imgHeight = img.height;

        let scale = 1;
        if (imgWidth > imgHeight) {
          scale = maxWidth / imgWidth;
        } else {
          scale = maxHeight / imgHeight;
        }

        // 캔버스 우하단 위치 계산 (여백 고려)
        const padding = Math.min(canvasWidth, canvasHeight) * 0.05; // 5% 여백
        const left = canvasWidth - (imgWidth * scale) / 2 - padding;
        const top = canvasHeight - (imgHeight * scale) / 2 - padding;

        // 이미지 객체 생성
        const stampImage = new fabric.Image(img, {
          left: left,
          top: top,
          originX: "center",
          originY: "center",
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          borderColor: "#2196F3",
          cornerColor: "#2196F3",
          cornerSize: 6,
          transparentCorners: false,
        });

        // 캔버스에 추가
        canvas.add(stampImage);
        canvas.setActiveObject(stampImage);
        canvas.renderAll();
      };

      // 이미지 로드 오류 처리
      img.onerror = () => {
        console.error("이미지 로드 실패");
      };
    } catch (error) {
      console.error("도장 추가 중 오류 발생:", error);
    }
  }, [fabricCanvasRef, selectedStampId, stamps]);

  const deleteSelectedObject = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  }, [fabricCanvasRef]);

  return {
    addStampToCanvas,
    deleteSelectedObject,
  };
};

export default useStampDrawing;
