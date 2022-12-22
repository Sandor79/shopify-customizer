import React from "react";
import ReactDOM from "react-dom";
import "@shopify/react-form";
import { AppProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import App from "./App";
import "./styles.css";

const theme = {
  colors: {},
  logo: {
    width: 124,
    topBarSource:
      "https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999",
    contextualSaveBarSource:
      "https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999",
    url: "/",
    accessibilityLabel: "Shopify App"
  }
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <AppProvider
      features={{ newDesignLanguage: true }}
      theme={theme}
      i18n={translations}
    >
      <App />
    </AppProvider>
  </React.StrictMode>,
  rootElement
);
