// src/pages/DashBoard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Home,
  Users,
  Settings,
  Wifi,
  LayoutDashboard,
} from "lucide-react";
import Total_users from "../components/Chart/Total_users.jsx";
import Todays_Accessor from "../components/Chart/Todays_Accessor.jsx";
import New_Registration from "../components/Chart/New_Registration.jsx";

/* ─────────────────────────────────────────────
   Axios 전역 설정: 토큰 자동 헤더 주입
─────────────────────────────────────────────*/
axios.defaults.baseURL = "/api";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const DashBoard = () => {
  /* 상태 */
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    todayVisitors: 0,
    newRegistrations: 0,
  });

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  /* 데이터 로딩 */
  useEffect(() => {
    // ① 프로필
    axios
      .get("/user/profile")
      .then((res) => setUserProfile(res.data))
      .catch((err) => console.error("프로필 정보 불러오기 실패:", err));

    // ② 대시보드 통계
    axios
      .get("/dashboard/stats")
      .then((res) => setDashboardData(res.data))
      .catch((err) => console.error("대시보드 데이터 가져오기 실패:", err));
  }, []);

  /* JSX */
  return (
    <div className="flex h-screen bg-gray-100">
      {/* ───────── 사이드바 ───────── */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold border-b">관리자 대시보드</div>
        <nav className="p-4 space-y-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="메인 대시보드" />
          <NavItem icon={<Users size={20} />} label="사용자 관리" />
          <NavItem
            href="/dashboard/server_status"
            icon={<Wifi size={20} />}
            label="서버 현황"
          />
          <NavItem icon={<Settings size={20} />} label="설정" />
          <NavItem href="/chatbot" icon={<Home size={20} />} label="홈" />
        </nav>
      </aside>

      {/* ───────── 본문 ───────── */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 overflow-auto">
          {/* 헤더 */}
          <Header />

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="총 사용자 수"
              value={dashboardData.totalUsers}
              unit="명"
            />
            <StatCard
              title="오늘의 접속자"
              value={dashboardData.todayVisitors}
              unit="명"
            />
            <StatCard
              title="신규 등록"
              value={dashboardData.newRegistrations}
              unit="건"
            />
          </div>

          {/* 차트 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <ChartBox title="총 사용자 추이">
              <Total_users />
            </ChartBox>
            <ChartBox title="오늘 접속 추이">
              <Todays_Accessor />
            </ChartBox>
            <ChartBox title="신규 등록 추이">
              <New_Registration />
            </ChartBox>
          </div>

          {/* 서버 상태 (데모) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ServerCard />
            <ServerCard />
          </div>
        </main>
      </div>
    </div>
  );
};

/* ───────────────── 재사용 컴포넌트 ───────────────── */
const NavItem = ({ icon, label, href = "#" }) => (
  <a
    href={href}
    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
  >
    {icon} {label}
  </a>
);

const Header = () => (
  <div className="flex items-center space-x-2 mb-6">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#222">
      <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
    </svg>
    <div>
      <h1 className="text-2xl font-semibold">대시보드</h1>
      <p className="text-sm text-gray-600">
        모든 시스템을 손쉽게 관리해보세요!
      </p>
    </div>
  </div>
);

const StatCard = ({ title, value, unit }) => (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-lg font-medium">{title}</h2>
    <p className="text-2xl font-bold mt-2">
      {value.toLocaleString()}
      {unit}
    </p>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    {children}
  </div>
);

const ServerCard = () => (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-lg font-semibold mb-2">서버 현황 (Demo)</h2>
    <p>상태: 정상</p>
    <p>평균 트래픽: 120 Mbps</p>
    <a href="/dashboard/server_status" className="text-blue-600">
      자세히 보기
    </a>
  </div>
);

export default DashBoard;
