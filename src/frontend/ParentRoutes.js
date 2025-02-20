import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App.js";

const ParentRoutes = () => {
  return (
    <Routes>
      <Route path="/:conversationId" element={<App />} />
    </Routes>
  );
};

export default ParentRoutes;
