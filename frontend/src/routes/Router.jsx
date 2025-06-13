// src/routes/Router.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";

import AdminPending from "../pages/AdminPending";
import MainPage from "../pages/MainPage";
import { CheckoutPage } from "../pages/pay/CheckoutPage";
import { SuccessPage } from "../pages/pay/SuccessPage";
import { FailPage } from "../pages/pay/FailPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/pending" element={<AdminPending />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/pay" element={<CheckoutPage />} />
        <Route path="/pay/success" element={<SuccessPage />} />
        <Route path="/pay/fail" element={<FailPage />} />
        {/* 예: <Route path="/" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
