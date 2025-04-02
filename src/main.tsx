import { createRoot } from "react-dom/client";
import { Global } from "@emotion/react";
import { globalStyles } from "@/styles/global";
import App from "@/App";

createRoot(document.getElementById("root")!).render(
  <>
    <Global styles={globalStyles} />
    <App />
  </>
);
