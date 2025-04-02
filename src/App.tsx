import StampControlPanel from "@/components/StampControl/StampControlPanel";
import PdfCanvas from "@/components/PdfEditor/PdfCanvas";
import PdfPageList from "@/components/PdfPreview/PdfPageList";

import "./App.css";

function App() {
  return (
    <div id="app">
      <div>
        <StampControlPanel />
        <PdfCanvas />
        <PdfPageList />
      </div>
    </div>
  );
}

export default App;
