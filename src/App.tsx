/** @jsxImportSource @emotion/react */
import ControlPanel from "@/components/ControlPanel/ControlPanel";
import PdfCanvas from "@/components/PdfEditor/PdfCanvas";
import PdfPageList from "@/components/PdfPreview/PdfPageList";
import {
  AppContainer,
  ContentWrapper,
  ControlPanelWrapper,
  PdfCanvasWrapper,
  PdfPageListWrapper,
} from "@/App.styles";

function App() {
  return (
    <AppContainer>
      <ContentWrapper>
        <ControlPanelWrapper>
          <ControlPanel />
        </ControlPanelWrapper>
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
