/** @jsxImportSource @emotion/react */
import StampControlPanel from "@/components/StampControl/StampControlPanel";
import PdfCanvas from "@/components/PdfEditor/PdfCanvas";
import PdfPageList from "@/components/PdfPreview/PdfPageList";
import {
  AppContainer,
  ContentWrapper,
  StampPanelWrapper,
  PdfCanvasWrapper,
  PdfPageListWrapper,
} from "@/App.styles";

function App() {
  return (
    <AppContainer>
      <ContentWrapper>
        <StampPanelWrapper>
          <StampControlPanel />
        </StampPanelWrapper>
        <PdfCanvasWrapper>
          <PdfCanvas />
        </PdfCanvasWrapper>
        <PdfPageListWrapper>
          <PdfPageList />
        </PdfPageListWrapper>
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;
