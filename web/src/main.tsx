import React from "react";
import {createRoot} from "react-dom/client";
import {QueryClientProvider, QueryClient} from "react-query";

import {App} from "./app.tsx";

import "./index.css";

const root = document.getElementById("root")!;

const queryClient = new QueryClient();

createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

