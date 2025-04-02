import { RefObject, useCallback, useEffect } from "react";
import * as fabric from "fabric";
import { useStore } from "@/store";

interface StampData {
  instanceId: string;
}

type FabricEvent = {
  target?: fabric.Object & {
    data?: StampData;
    getSrc?: () => string;
  };
};

const useStampDrawing = (fabricCanvasRef: RefObject<fabric.Canvas | null>) => {
  const {
    stamps,
    selectedStampId,
    currentPage,
    addStampInstance,
    removeStampInstance,
    getPageStampInstances,
  } = useStore();

  /**
   * 현재 페이지에 이미 찍힌 도장들 불러오기
   */
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    // 캔버스 초기화 시 스토어에서 현재 페이지 도장 인스턴스 불러오기
    const loadPageStamps = () => {
      const pageStamps = getPageStampInstances(currentPage);

      // 각 도장 인스턴스를 캔버스에 추가
      pageStamps.forEach((instance) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = instance.url;

        img.onload = () => {
          if (!fabricCanvasRef.current) return;

          const stampImage = new fabric.Image(img);

          // 객체에 데이터 추가를 위한 확장
          (stampImage as any).data = { instanceId: instance.id };

          // 인스턴스의 속성대로 설정
          stampImage.set({
            left: instance.left,
            top: instance.top,
            originX: "center",
            originY: "center",
            scaleX: instance.scaleX,
            scaleY: instance.scaleY,
            selectable: true,
            hasControls: true,
            hasBorders: true,
            borderColor: "#2196F3",
            cornerColor: "#2196F3",
            cornerSize: 6,
            transparentCorners: false,
          });

          canvas.add(stampImage);
          canvas.renderAll();
        };
      });
    };

    // 페이지 변경 시 이미 찍힌 도장 불러오기
    loadPageStamps();

    // 객체 수정 이벤트 - 도장 위치/크기 변경 시 저장
    const handleObjectModified = (e: FabricEvent) => {
      const target = e.target;
      if (!target) return;

      const instanceId = target.data?.instanceId;
      if (!instanceId) return;

      // 기존 인스턴스 제거 후 수정된 속성으로 다시 추가
      removeStampInstance(instanceId);

      const url = target.getSrc ? target.getSrc() : "";

      addStampInstance({
        id: instanceId,
        stampId: selectedStampId || "unknown",
        pageNumber: currentPage,
        left: target.left || 0,
        top: target.top || 0,
        scaleX: target.scaleX || 1,
        scaleY: target.scaleY || 1,
        url: url,
      });
    };

    // 객체 삭제 이벤트 - 도장 삭제 시 인스턴스도 삭제
    canvas.on("object:modified", handleObjectModified as any);

    return () => {
      canvas.off("object:modified", handleObjectModified as any);
    };
  }, [
    fabricCanvasRef,
    currentPage,
    getPageStampInstances,
    addStampInstance,
    removeStampInstance,
    selectedStampId,
  ]);

  /**
   * 선택된 도장을 캔버스에 추가하는 함수
   */
  const addStampToCanvas = useCallback(() => {
    if (!fabricCanvasRef.current || !selectedStampId) {
      return;
    }

    try {
      // 선택된 도장 찾기
      const selectedStamp = stamps.find(
        (stamp) => stamp.id === selectedStampId
      );
      if (!selectedStamp) {
        return;
      }

      const canvas = fabricCanvasRef.current;

      // 이미지 생성 및 로드
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = selectedStamp.url;

      img.onload = () => {
        // 이미지 생성
        const stampImage = new fabric.Image(img);

        // 이미지 최대 크기 설정 (실제 도장 크기와 유사하게)
        const maxSize = 40;

        // 이미지 원본 크기 가져오기
        const imgWidth = img.width || 100;
        const imgHeight = img.height || 100;

        // 적절한 스케일 계산
        const scaleX = Math.min(maxSize / imgWidth, maxSize / imgHeight);
        const scaleY = scaleX;

        // 캔버스 우하단 위치 계산
        const canvasWidth = canvas.width || 500;
        const canvasHeight = canvas.height || 707;

        // 우하단에 위치 (여백 증가)
        const left = canvasWidth - (imgWidth * scaleX) / 2 - 60;
        const top = canvasHeight - (imgHeight * scaleY) / 2 - 60;

        // 도장 인스턴스 ID 생성
        const instanceId =
          Date.now().toString() + Math.random().toString(36).substring(2, 9);

        // 객체에 데이터 추가를 위한 확장
        (stampImage as any).data = { instanceId };

        // 이미지 속성 설정
        stampImage.set({
          left: left,
          top: top,
          originX: "center",
          originY: "center",
          scaleX: scaleX,
          scaleY: scaleY,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          borderColor: "#2196F3",
          cornerColor: "#2196F3",
          cornerSize: 6,
          transparentCorners: false,
        });

        // 캔버스에 도장 추가
        canvas.add(stampImage);
        canvas.setActiveObject(stampImage);
        canvas.renderAll();

        // 도장 인스턴스 저장
        addStampInstance({
          id: instanceId,
          stampId: selectedStampId,
          pageNumber: currentPage,
          left: left,
          top: top,
          scaleX: scaleX,
          scaleY: scaleY,
          url: selectedStamp.url,
        });
      };
    } catch (error) {
      console.error("도장 추가 중 오류 발생:", error);
    }
  }, [fabricCanvasRef, selectedStampId, stamps, currentPage, addStampInstance]);

  /**
   * 선택된 객체 삭제 함수
   */
  const deleteSelectedObject = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      // 인스턴스 ID 가져오기
      const instanceId = (activeObject as any).data?.instanceId;

      // 캔버스에서 객체 제거
      canvas.remove(activeObject);
      canvas.renderAll();

      // 스토어에서 인스턴스 제거
      if (instanceId) {
        removeStampInstance(instanceId);
      }
    }
  }, [fabricCanvasRef, removeStampInstance]);

  return {
    addStampToCanvas,
    deleteSelectedObject,
  };
};

export default useStampDrawing;
