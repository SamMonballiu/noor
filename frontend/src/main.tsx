import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MainPage } from "./MainPage.tsx";
import { TrackProvider } from "./contexts/TrackContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TrackProvider>
        <MainPage />
      </TrackProvider>
    </QueryClientProvider>
  </StrictMode>,
);
