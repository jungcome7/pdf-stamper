import { useRef } from "react";
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
import {
  useRenderPdfToCanvas,
  useStampDrawing,
  useStampDrawEvent,
  useKeyboardShortcuts,
} from "@/hooks";
import { generatePdfWithStamps } from "@/utils";

const PdfCanvas = () => {
  const { file, selectedStampId, stampInstances } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { fabricCanvasRef, error, isLoading } = useRenderPdfToCanvas(
    file,
    canvasRef
  );
  const { addStampToCanvas, deleteSelectedObject } =
    useStampDrawing(fabricCanvasRef);

  const isStampReady =
    selectedStampId !== null &&
    selectedStampId !== undefined &&
    fabricCanvasRef.current !== null;

  useStampDrawEvent({
    isStampReady,
    addStampToCanvas,
  });

  useKeyboardShortcuts({
    deleteSelectedObject,
  });

  const handlePDFDownload = async () => {
    if (!file) {
      alert("PDF 파일을 먼저 업로드해주세요.");
      return;
    }

    try {
      await generatePdfWithStamps(file, stampInstances);
    } catch (error) {
      alert(`PDF 다운로드 중 오류가 발생했습니다: ${error}`);
    }
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
