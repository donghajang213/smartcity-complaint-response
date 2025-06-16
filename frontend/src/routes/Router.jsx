// src/routes/Router.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Signup       from "../pages/Signup";
import Login        from "../pages/Login";
import AdminPending from "../pages/AdminPending";
import HomePage     from "../pages/HomePage";   // 비디오 히어로
import ChatPage     from "../pages/ChatPage";   // 챗봇 메인
<<<<<<< HEAD
<<<<<<< HEAD
import DashBoard     from "../pages/DashBoard"; 
import ServerStatusDashboard     from "../pages/Server_Status_DashBoard"; 
import UserManagementDashboard    from "../pages/User_Management_DashBoard "; 
=======
>>>>>>> parent of f1e1538 (Merge pull request #52 from donghajang213/feature/frontend/guil)
=======
>>>>>>> parent of 5778eca ( guil backend)

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
<<<<<<< HEAD
      {/* 관리자 대시보드 페이지 */}
      <Route path="/dashboard"    element={<DashBoard />} />
      <Route path="/dashboard/ServerStatusDashboard"    element={<ServerStatusDashboard />} />
      <Route path="/dashboard/UserManagementDashboard"    element={<UserManagementDashboard />} />    
=======

>>>>>>> parent of f1e1538 (Merge pull request #52 from donghajang213/feature/frontend/guil)
      {/* 그 외 경로는 홈으로 */}
      <Route path="*"           element={<Navigate to="/" replace />} />
    </Routes>
  );
}
