import { useRef, useEffect } from "react";
import { useStore } from "@/store";

import {
  Container,
  CanvasWrapper,
  Canvas,
  DownloadButton,
  ErrorMessage,
  LoadingOverlay,
  LoadingMessage,
  ErrorIcon,
} from "./PdfCanvas.styles";
import { useRenderPdfToCanvas, useStampDrawing } from "@/hooks";
import { STAMP_DRAW_EVENT } from "@/constants";

const PdfCanvas = () => {
  const { file, selectedStampId } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { fabricCanvasRef, error, isLoading } = useRenderPdfToCanvas(
    file,
    canvasRef
  );
  const { addStampToCanvas, deleteSelectedObject } =
    useStampDrawing(fabricCanvasRef);

  useEffect(() => {
    const handleStampDrawEvent = () => {
      if (selectedStampId && fabricCanvasRef.current) {
        addStampToCanvas();
      }
    };

    document.addEventListener(STAMP_DRAW_EVENT, handleStampDrawEvent);

    return () => {
      document.removeEventListener(STAMP_DRAW_EVENT, handleStampDrawEvent);
    };
  }, [selectedStampId, fabricCanvasRef, addStampToCanvas]);

  // 키보드 단축키 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        deleteSelectedObject();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteSelectedObject]);

  const handlePDFDownload = async () => {
    // PDF 다운로드 로직 (미구현)
  };

  return (
    <Container>
      <CanvasWrapper>
        <Canvas
          ref={canvasRef}
          tabIndex={0} // 캔버스가 키보드 이벤트를 받을 수 있도록 함
        />

        {isLoading && (
          <LoadingOverlay>
            <LoadingMessage>PDF 로딩 중...</LoadingMessage>
          </LoadingOverlay>
        )}

        {error && (
          <ErrorMessage>
            <ErrorIcon role="img" aria-label="error">
              ⚠️
            </ErrorIcon>
            {error.message}
          </ErrorMessage>
        )}

        <DownloadButton type="button" onClick={handlePDFDownload}>
          PDF 다운로드
        </DownloadButton>
      </CanvasWrapper>
    </Container>
  );
};

export default PdfCanvas;
