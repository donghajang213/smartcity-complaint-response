// src/routes/Router.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";

import AdminPending from "../pages/AdminPending";
import MainPage from "../pages/MainPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/pending" element={<AdminPending />} />
        <Route path="/home" element={<MainPage />} />
        {/* 예: <Route path="/" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
