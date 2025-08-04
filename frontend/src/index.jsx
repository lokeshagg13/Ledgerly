import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./store/context/authContext";
import { NavProvider } from "./store/context/navContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NavProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </NavProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
