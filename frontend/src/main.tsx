import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MainPage } from "./MainPage.tsx";
import { TrackProvider } from "./contexts/TrackContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TrackProvider>
      <MainPage />
    </TrackProvider>
  </StrictMode>,
);
