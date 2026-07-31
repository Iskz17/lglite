import * as React from "react";
import { createRoot } from "react-dom/client";
import "@lglite/react/styles.css";
import "./styles.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
