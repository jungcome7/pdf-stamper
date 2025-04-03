import { useCallback, useEffect } from "react";
import * as fabric from "fabric";
import { useStore } from "@/store";
import { createStampedPageImage } from "@/utils";
import {
  CANVAS_OBJECT_STYLES,
  MAX_STAMP_SIZE,
  STAMP_POSITION,
} from "@/constants";
import {
  StampInstance,
  FabricEvent,
  FabricCanvasRef,
  StampImageCreator,
  Scale,
  Position,
  FabricStampImage,
  FabricEventHandler,
  FabricObjectWithData,
} from "@/types";

/**
 * 도장 그리기 관련 기능을 제공하는 커스텀 훅
 * @param fabricCanvasRef Fabric.js 캔버스에 대한 참조
 * @returns 도장 관련 기능을 제공하는 메서드들을 포함하는 객체
 */
const useStampDrawing = (fabricCanvasRef: FabricCanvasRef) => {
  const {
    stamps,
    selectedStampId,
    currentPage,
    addStampInstance,
    removeStampInstance,
    getPageStampInstances,
    updatePageImage,
  } = useStore();

  /**
   * 현재 페이지 이미지를 업데이트하는 함수
   */
  const updateCurrentPageImage = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const imageUrl = createStampedPageImage(fabricCanvasRef.current);

    if (imageUrl) {
      updatePageImage(currentPage, imageUrl);
    }
  }, [fabricCanvasRef, currentPage, updatePageImage]);

  /**
   * 도장 인스턴스로부터 Fabric 이미지 객체를 생성하는 함수
   * @param instance 도장 인스턴스 정보
   * @param onLoad 이미지 로드 완료 후 실행할 콜백 함수
   */
  const createStampImageFromInstance = useCallback(
    (instance: StampInstance, onLoad: StampImageCreator) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = instance.url;

      img.onload = () => {
        if (!fabricCanvasRef.current) return;

        const stampImage = new fabric.FabricImage(img) as FabricStampImage;
        stampImage.data = { instanceId: instance.id };

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
          borderColor: CANVAS_OBJECT_STYLES.BORDER_COLOR,
          cornerColor: CANVAS_OBJECT_STYLES.CORNER_COLOR,
          cornerSize: CANVAS_OBJECT_STYLES.CORNER_SIZE,
          transparentCorners: false,
        });

        onLoad(stampImage);
      };
    },
    [fabricCanvasRef]
  );

  /**
   * 현재 페이지에 저장된 도장들을 로드하는 함수
   */
  const loadPageStamps = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const pageStamps = getPageStampInstances(currentPage);

    pageStamps.forEach((instance) => {
      createStampImageFromInstance(instance, (stampImage) => {
        canvas.add(stampImage);
        canvas.renderAll();
      });
    });
  }, [
    fabricCanvasRef,
    currentPage,
    getPageStampInstances,
    createStampImageFromInstance,
  ]);

  /**
   * 도장 객체가 수정되었을 때 처리하는 이벤트 핸들러
   * @param e Fabric 이벤트 객체
   */
  const handleStampModified: FabricEventHandler = useCallback(
    (e: FabricEvent) => {
      const target = e.target;
      if (!target) return;

      const instanceId = target.data?.instanceId;
      if (!instanceId) return;

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

      updateCurrentPageImage();
    },
    [
      selectedStampId,
      currentPage,
      addStampInstance,
      removeStampInstance,
      updateCurrentPageImage,
    ]
  );

  /**
   * 페이지 변경 시 도장 로드 및 이벤트 설정
   */
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    loadPageStamps();

    canvas.on("object:modified", handleStampModified);

    return () => {
      canvas.off("object:modified", handleStampModified);
    };
  }, [fabricCanvasRef, loadPageStamps, handleStampModified]);

  /**
   * 도장 크기 계산 함수
   * @param imgWidth 이미지 원본 너비
   * @param imgHeight 이미지 원본 높이
   * @returns 적절한 스케일 비율
   */
  const calculateStampScale = useCallback(
    (imgWidth: number, imgHeight: number): Scale => {
      const scaleX = Math.min(
        MAX_STAMP_SIZE / imgWidth,
        MAX_STAMP_SIZE / imgHeight
      );
      return { scaleX, scaleY: scaleX };
    },
    []
  );

  /**
   * 도장 위치 계산 함수
   * @param canvas Fabric 캔버스 객체
   * @param imgWidth 이미지 원본 너비
   * @param imgHeight 이미지 원본 높이
   * @param scale 스케일 정보
   * @returns 도장 위치 좌표
   */
  const calculateStampPosition = useCallback(
    (
      canvas: fabric.Canvas,
      imgWidth: number,
      imgHeight: number,
      scale: Scale
    ): Position => {
      const canvasWidth = canvas.width || 500;
      const canvasHeight = canvas.height || 707;

      return {
        left:
          canvasWidth - (imgWidth * scale.scaleX) / 2 - STAMP_POSITION.MARGIN,
        top:
          canvasHeight - (imgHeight * scale.scaleY) / 2 - STAMP_POSITION.MARGIN,
      };
    },
    []
  );

  /**
   * 도장 인스턴스의 고유 ID를 생성하는 함수
   * @returns 고유 ID 문자열
   */
  const generateStampInstanceId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  }, []);

  /**
   * 선택된 도장을 캔버스에 추가하는 함수
   */
  const addStampToCanvas = useCallback(() => {
    if (!fabricCanvasRef.current || !selectedStampId) return;

    try {
      const selectedStamp = stamps.find(
        (stamp) => stamp.id === selectedStampId
      );
      if (!selectedStamp) return;

      const canvas = fabricCanvasRef.current;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = selectedStamp.url;

      img.onload = () => {
        const stampImage = new fabric.FabricImage(img) as FabricStampImage;

        const imgWidth = img.width || 100;
        const imgHeight = img.height || 100;

        const scale = calculateStampScale(imgWidth, imgHeight);

        const position = calculateStampPosition(
          canvas,
          imgWidth,
          imgHeight,
          scale
        );

        const instanceId = generateStampInstanceId();

        stampImage.data = { instanceId };

        stampImage.set({
          left: position.left,
          top: position.top,
          originX: "center",
          originY: "center",
          scaleX: scale.scaleX,
          scaleY: scale.scaleY,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          borderColor: CANVAS_OBJECT_STYLES.BORDER_COLOR,
          cornerColor: CANVAS_OBJECT_STYLES.CORNER_COLOR,
          cornerSize: CANVAS_OBJECT_STYLES.CORNER_SIZE,
          transparentCorners: false,
        });

        canvas.add(stampImage);
        canvas.setActiveObject(stampImage);
        canvas.renderAll();

        addStampInstance({
          id: instanceId,
          stampId: selectedStampId,
          pageNumber: currentPage,
          left: position.left,
          top: position.top,
          scaleX: scale.scaleX,
          scaleY: scale.scaleY,
          url: selectedStamp.url,
        });

        updateCurrentPageImage();
      };
    } catch (error) {
      console.error("도장 추가 중 오류 발생:", error);
    }
  }, [
    fabricCanvasRef,
    selectedStampId,
    stamps,
    currentPage,
    addStampInstance,
    updateCurrentPageImage,
    calculateStampScale,
    calculateStampPosition,
    generateStampInstanceId,
  ]);

  /**
   * 선택된 도장 객체를 삭제하는 함수
   */
  const deleteSelectedObject = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject() as FabricObjectWithData;

    if (activeObject) {
      const instanceId = activeObject.data?.instanceId;

      canvas.remove(activeObject);
      canvas.renderAll();

      if (instanceId) {
        removeStampInstance(instanceId);
        updateCurrentPageImage();
      }
    }
  }, [fabricCanvasRef, removeStampInstance, updateCurrentPageImage]);

  return {
    addStampToCanvas,
    deleteSelectedObject,
  };
};

export default useStampDrawing;
