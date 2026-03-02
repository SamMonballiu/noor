import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MainPage } from "./MainPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TrackQueueProvider } from "./contexts/TrackQueueContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TrackQueueProvider>
        <MainPage />
      </TrackQueueProvider>
    </QueryClientProvider>
  </StrictMode>,
);
