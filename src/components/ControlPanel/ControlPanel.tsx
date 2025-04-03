import { useRef } from "react";
import { useStore } from "@/store";
import StampManager from "./StampManager";
import {
  Container,
  TopSection,
  PdfUploadArea,
  PdfFileArea,
  BottomSection,
  Button,
  RemoveButton,
} from "./ControlPanel.styles";
import { STAMP_DRAW_EVENT, FILE_TYPES, FILE_EXTENSIONS } from "@/constants";

const ControlPanel = () => {
  const { file, setFile, selectedStampId } = useStore();
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      throw new Error("PDF 파일을 선택해주세요.");
    }

    if (!file.type.includes(FILE_TYPES.PDF)) {
      throw new Error("PDF 파일만 업로드 가능합니다.");
    }

    setFile(file);

    e.target.value = "";
  };

  const handlePDFUpload = () => {
    pdfInputRef.current?.click();
  };

  const handlePDFRemove = () => {
    setFile(null);
  };

  const handleStampDraw = async () => {
    if (!selectedStampId) {
      alert("도장을 선택해주세요.");
      return;
    }

    if (!file) {
      alert("PDF를 먼저 업로드해주세요.");
      return;
    }

    document.dispatchEvent(new CustomEvent(STAMP_DRAW_EVENT));
  };

  const isStampButtonDisabled = !selectedStampId || !file;

  return (
    <Container>
      <TopSection>
        <div>
          <PdfUploadArea>
            <input
              ref={pdfInputRef}
              type="file"
              accept={`${FILE_EXTENSIONS.PDF},${FILE_TYPES.PDF}`}
              onChange={handlePDFChange}
              style={{ display: "none" }}
            />

            <Button type="button" onClick={handlePDFUpload}>
              PDF 업로드
            </Button>
          </PdfUploadArea>

          <PdfFileArea>
            {!!file?.name && (
              <>
                📄 파일명: <strong>{file?.name}</strong>
                <RemoveButton type="button" onClick={handlePDFRemove}>
                  X
                </RemoveButton>
              </>
            )}
          </PdfFileArea>
        </div>

        <StampManager />
      </TopSection>

      <BottomSection>
        <Button
          type="button"
          onClick={handleStampDraw}
          disabled={isStampButtonDisabled}
          style={{
            opacity: isStampButtonDisabled ? 0.5 : 1,
            cursor: isStampButtonDisabled ? "not-allowed" : "pointer",
          }}
        >
          도장 찍기
        </Button>
      </BottomSection>
    </Container>
  );
};

export default ControlPanel;
