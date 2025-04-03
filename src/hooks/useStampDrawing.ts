import { RefObject, useCallback, useEffect } from "react";
import * as fabric from "fabric";
import { useStore } from "@/store";
import { createStampedPageImage } from "@/utils";
import {
  CANVAS_OBJECT_STYLES,
  MAX_STAMP_SIZE,
  STAMP_POSITION,
} from "@/constants";
import { StampInstance } from "@/types";

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
    updatePageImage,
  } = useStore();

  const updateCurrentPageImage = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const imageUrl = createStampedPageImage(fabricCanvasRef.current);

    if (imageUrl) {
      updatePageImage(currentPage, imageUrl);
    }
  }, [fabricCanvasRef, currentPage, updatePageImage]);

  const createStampImageFromInstance = useCallback(
    (
      instance: StampInstance,
      onLoad: (stampImage: fabric.FabricImage) => void
    ) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = instance.url;

      img.onload = () => {
        if (!fabricCanvasRef.current) return;

        const stampImage = new fabric.FabricImage(img);
        (stampImage as any).data = { instanceId: instance.id };

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

  const handleStampModified = useCallback(
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

  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    loadPageStamps();

    canvas.on("object:modified", handleStampModified as any);

    return () => {
      canvas.off("object:modified", handleStampModified as any);
    };
  }, [fabricCanvasRef, loadPageStamps, handleStampModified]);

  const calculateStampScale = useCallback(
    (imgWidth: number, imgHeight: number) => {
      const scaleX = Math.min(
        MAX_STAMP_SIZE / imgWidth,
        MAX_STAMP_SIZE / imgHeight
      );
      return { scaleX, scaleY: scaleX };
    },
    []
  );

  const calculateStampPosition = useCallback(
    (
      canvas: fabric.Canvas,
      imgWidth: number,
      imgHeight: number,
      scale: { scaleX: number; scaleY: number }
    ) => {
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

  const generateStampInstanceId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  }, []);

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
        const stampImage = new fabric.FabricImage(img);

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

        (stampImage as any).data = { instanceId };

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

  const deleteSelectedObject = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      const instanceId = (activeObject as any).data?.instanceId;

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
