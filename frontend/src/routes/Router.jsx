// src/routes/Router.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Signup       from "../pages/Signup";
import Login        from "../pages/Login";
import AdminPending from "../pages/AdminPending";
import Subscribe from "../pages/subscribe";
import HomePage     from "../pages/HomePage";   // 비디오 히어로
import ChatPage     from "../pages/ChatPage";   // 챗봇 메인
import DashBoard     from "../pages/DashBoard"; 
import Server_Status_DashBoard     from "../pages/Server_Status_DashBoard"; 
import User_Management_DashBoard    from "../pages/User_Management_DashBoard "; 

export default function Router() {
  return (
    <Routes>
      {/* 공개 페이지 */}
      <Route path="/"           element={<HomePage />} />
      <Route path="/login"      element={<Login />} />
      <Route path="/signup"     element={<Signup />} />
      <Route path="/admin/pending" element={<AdminPending />} />

      {/* 로그인 후 챗봇 페이지 */}
      <Route path="/chatbot"    element={<ChatPage />} />
      {/* 그 외 경로는 홈으로 */}
      <Route path="*"           element={<Navigate to="/" replace />} />
    </Routes>
  );
}
