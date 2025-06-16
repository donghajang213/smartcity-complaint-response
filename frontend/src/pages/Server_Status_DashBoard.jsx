// src/pages/ServerStatusDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Home,
  Users,
  Settings,
  Wifi,
  LayoutDashboard,
} from "lucide-react";
import Server_Network_Status from "../components/Chart/Server_Network_Status.jsx";
import Server_Uptime from "../components/Chart/Server_Uptime.jsx";

/* ─────────────────────────────────────────────
   Axios 전역 설정: 토큰 자동 주입
─────────────────────────────────────────────*/
axios.defaults.baseURL = "/api";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ServerStatusDashboard = () => {
  /* 상태 */
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [serverStats, setServerStats] = useState({
    cpu: 0,
    memoryUsed: 0,
    memoryTotal: 0,
    disk: 0,
    currentUsers: 0,
    avgLatency: 0,
    networkState: "정상",
    mainServer: "정상",
    proxyServer: "정상",
    dbServer: "정상",
  });

  /* 데이터 로딩 */
  useEffect(() => {
    // ① 사용자 프로필
    axios
      .get("/user/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("프로필 불러오기 실패:", err));

    // ② 서버 현황
    axios
      .get("/server/status")
      .then((res) => setServerStats(res.data))
      .catch((err) => console.error("서버 현황 불러오기 실패:", err));
  }, []);

  /* 계산된 값 */
  const memoryText = `${(serverStats.memoryUsed / 1024).toFixed(1)}GB / ${
    serverStats.memoryTotal / 1024
  }GB`;

  /* JSX */
  return (
    <div className="flex h-screen bg-gray-100">
      {/* ───── 사이드바 ───── */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold border-b">관리자 대시보드</div>
        <nav className="p-4 space-y-4">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />}>
            메인 대시보드
          </NavItem>
          <NavItem href="/dashboard/manager" icon={<Users size={20} />}>
            사용자 관리
          </NavItem>
          <NavItem
            href="/dashboard/server_status"
            icon={<Wifi size={20} />}
          >
            서버 현황
          </NavItem>
          <NavItem icon={<Settings size={20} />}>설정</NavItem>
          <NavItem href="/chatbot" icon={<Home size={20} />}>
            홈
          </NavItem>
        </nav>
      </aside>

      {/* ───── 본문 ───── */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 overflow-auto">
          {/* 헤더 */}
          <Header />

          {/* 서버 자원 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard title="서버 CPU 사용률" value={`${serverStats.cpu}%`} />
            <StatCard title="서버 메모리 사용량" value={memoryText} />
            <StatCard title="서버 디스크 용량" value={`${serverStats.disk} GB`} />
          </div>

          {/* 서버 상세 상태 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <InfoCard title="서버 네트워크 현황">
              <p>평균 접속자: {serverStats.currentUsers}명</p>
              <p>평균 응답 시간: {serverStats.avgLatency} ms</p>
              <p>네트워크 상태: {serverStats.networkState}</p>
              <p>대역폭: 1 Gbps</p>
            </InfoCard>

            <InfoCard title="서버 상태">
              <p>현재 접속자: {serverStats.currentUsers}명</p>
              <p>메인 서버: {serverStats.mainServer}</p>
              <p>프록시 서버: {serverStats.proxyServer}</p>
              <p>DB 서버: {serverStats.dbServer}</p>
            </InfoCard>
          </div>

          {/* 차트 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartBox>
              <Server_Network_Status />
            </ChartBox>
            <ChartBox>
              <Server_Uptime />
            </ChartBox>
          </div>
        </main>
      </div>
    </div>
  );
};

/* ───────── 재사용 컴포넌트 ───────── */
const NavItem = ({ icon, href = "#", children }) => (
  <a
    href={href}
    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
  >
    {icon} {children}
  </a>
);

const Header = () => (
  <div className="flex items-center gap-2 mb-6">
    <svg width="40" height="40" viewBox="0 0 16 16" fill="#2e3436">
      <path d="M8 1.99c-2.62 0-5.24.93-7.2 2.81l-.5.48a.99.99 0 1 0 1.41 1.41l.5-.48c3.09-2.96 8.53-2.96 11.62 0l.5.48a.99.99 0 1 0 1.41-1.41l-.5-.48C13.24 2.92 10.63 1.99 8 1.99Zm0 4.01c-1.57 0-3.13.63-4.21 1.81l-.5.55a.99.99 0 0 0 1.51 1.31l.5-.55c1.28-1.4 4.16-1.5 5.53 0l.5.55a.99.99 0 0 0 1.51-1.31l-.5-.55C11.13 6.64 9.57 6 8 6Zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    </svg>
    <div>
      <h1 className="text-2xl font-semibold">서버 현황</h1>
      <p className="text-sm text-gray-600">
        서버 상태를 한눈에 진단해보세요!
      </p>
    </div>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-lg font-medium">{title}</h2>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const InfoCard = ({ title, children }) => (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    {children}
  </div>
);

const ChartBox = ({ children }) => (
  <div className="p-4 bg-white rounded shadow">{children}</div>
);

export default ServerStatusDashboard;
