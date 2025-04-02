import { useRef } from "react";
import { useStore } from "@/store";
import Stamp1 from "@/assets/stamp-1.jpg";
import {
  Container,
  TopSection,
  StampUploadArea,
  StampsContainer,
  PdfUploadArea,
  PdfFileArea,
  BottomSection,
  Button,
  RemoveButton,
} from "./StampControlPanel.styles";

const StampControlPanel = () => {
  const { file, setFile } = useStore();

  const stampInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setFile(file!);

    e.target.value = "";
  };

  const handleStampUpload = () => {
    stampInputRef.current?.click();
  };

  const handlePDFUpload = () => {
    pdfInputRef.current?.click();
  };

  const handlePDFRemove = () => {
    setFile(null);
  };

  const handleStampDraw = async () => {};

  return (
    <Container>
      <TopSection>
        <div>
          <PdfUploadArea>
            <input
              ref={pdfInputRef}
              type="file"
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

        <div>
          <StampUploadArea>
            <input
              ref={stampInputRef}
              type="file"
              accept=".png"
              onChange={() => {}}
              style={{ display: "none" }}
            />
            <Button type="button" onClick={handleStampUpload}>
              도장 업로드
            </Button>
          </StampUploadArea>

          <StampsContainer>
            <img src={Stamp1} />
          </StampsContainer>
        </div>
      </TopSection>

      <BottomSection>
        <Button type="button" onClick={handleStampDraw}>
          도장 찍기
        </Button>
      </BottomSection>
    </Container>
  );
};

export default StampControlPanel;
