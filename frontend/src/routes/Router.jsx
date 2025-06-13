// src/routes/Router.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";

import AdminPending from "../pages/AdminPending";
import MainPage from "../pages/MainPage";
import Subscribe from "../pages/subscribe";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/pending" element={<AdminPending />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/subscribe" element={<Subscribe />} />
        {/* 예: <Route path="/" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
