// src/routes/Router.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Signup       from "../pages/Signup";
import Login        from "../pages/Login";
import NaverCallback from "../pages/NaverCallback";
// import AdminPending from "../pages/AdminPending";
import Subscribe from "../pages/Subscribe";
import HomePage     from "../pages/HomePage";   // 비디오 히어로
import ChatPage     from "../pages/ChatPage";   // 챗봇 메인
import MainPage from "../pages/MainPage";
import AdminDashboard from "../pages/AdminDashboard";
import ServerStatusPage from "../pages/ServerStatusPage";
import UserManagementPage from "../pages/UserManagementPage";

import { CheckoutPage } from "../pages/pay/CheckoutPage";
import { SuccessPage } from "../pages/pay/SuccessPage";
import { FailPage } from "../pages/pay/FailPage";
import AdminSettings from "../pages/AdminSettings";

import StatPage from "../pages/stats/StatPage";

export default function Router() {
  return (
    <Routes>
      {/* 공개 페이지 */}
      <Route path="/"           element={<HomePage />} />
      <Route path="/main"       element={<MainPage />} />
      <Route path="/login"      element={<Login />} />
      <Route path="/signup"     element={<Signup />} />
      <Route path="/naver/callback/" element={<NaverCallback />} />
      {/* <Route path="/admin/pending" element={<AdminPending />} /> */}
      <Route path="/subscribe" element={<Subscribe />} />
      {/* 로그인 후 챗봇 페이지 */}
      <Route path="/chatbot"    element={<ChatPage />} />

      {/* 관리 페이지 */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/dashboard/serverstatus" element={<ServerStatusPage />} />
      <Route path="/admin/dashboard/users" element={<UserManagementPage />} />
      <Route path="/admin/dashboard/settings" element={<AdminSettings />} />

      {/* 그 외 경로는 홈으로 */}
      <Route path="*"           element={<Navigate to="/" replace />} />
      {/* 결제 관련 페이지 */}
        <Route path="/pay" element={<CheckoutPage />} />
        <Route path="/pay/success" element={<SuccessPage />} />
        <Route path="/pay/fail" element={<FailPage />} />

      {/* 통계 그래프 페이지 */}
      <Route path="/stats/category" element={<StatPage />} />
        {/* 예: <Route path="/" element={<Home />} /> */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
  );
}
