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

const ControlPanel = () => {
  const { file, setFile, selectedStampId } = useStore();
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      throw new Error("PDF 파일을 선택해주세요.");
    }

    if (!file.type.includes("pdf")) {
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

    // 도장 찍기 로직 구현 (아직 미구현)
    console.log("선택된 도장:", selectedStampId);
  };

  return (
    <Container>
      <TopSection>
        <div>
          <PdfUploadArea>
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,application/pdf"
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

        {/* 도장 관리 컴포넌트 */}
        <StampManager />
      </TopSection>

      <BottomSection>
        <Button
          type="button"
          onClick={handleStampDraw}
          disabled={!selectedStampId}
        >
          도장 찍기
        </Button>
      </BottomSection>
    </Container>
  );
};

export default ControlPanel;
