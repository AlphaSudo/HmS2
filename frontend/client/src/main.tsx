import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./assets/styles.css";
import "./lib/i18n"; // Initialize i18n

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
