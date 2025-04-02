import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { getImageByFile } from "@/utils";
import {
  Container,
  TopSection,
  ImageContainer,
  Image,
  ImageIndex,
} from "./PdfPageList.styles";

const PdfPageList = () => {
  const { file } = useStore();
  const [fileImage, setFileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    (async () => {
      setFileImage((await getImageByFile(file)) ?? "");
    })();
  }, [file]);

  return (
    <Container>
      <TopSection>
        {fileImage && (
          <div>
            <ImageContainer>
              <Image src={fileImage} />
            </ImageContainer>
            <ImageIndex>1</ImageIndex>
          </div>
        )}
      </TopSection>
    </Container>
  );
};

export default PdfPageList;
