import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import Layout from "./layout.tsx";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <App />
      </Layout>
    </BrowserRouter>
  </StrictMode>
);
