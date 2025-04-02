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
import useRenderPdfToCanvas from "@/hooks/useRenderPdfToCanvas";

const PdfCanvas = () => {
  const { file } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { error, isLoading } = useRenderPdfToCanvas(file, canvasRef);

  const handlePDFDownload = async () => {};

  return (
    <Container>
      <CanvasWrapper>
        <Canvas ref={canvasRef} />

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
