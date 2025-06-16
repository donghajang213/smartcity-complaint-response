// src/pages/UserManagementDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Home,
  Users,
  Settings,
  Wifi,
  LayoutDashboard,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Axios 전역 설정: JWT 헤더 자동 주입
─────────────────────────────────────────────*/
axios.defaults.baseURL = "/api";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const UserManagementDashboard = () => {
  /* 상태 */
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 데이터 로딩 */
  useEffect(() => {
    axios
      .get("/users") // → /api/users
      .then((res) => setUsers(res.data))
      .catch((err) =>
        console.error("사용자 데이터를 불러오는 중 오류:", err)
      )
      .finally(() => setLoading(false));
  }, []);

  /* 집계 */
  const totalUsers = users.length;
  const newUsersCount = users.filter((u) => {
    const diffDays =
      (Date.now() - new Date(u.createdAt)) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  /* JSX */
  return (
    <div className="flex h-screen bg-gray-100">
      {/* ───────── 사이드바 ───────── */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold border-b">
          관리자 대시보드
        </div>
        <nav className="p-4 space-y-4">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />}>
            메인 대시보드
          </NavItem>
          <NavItem icon={<Users size={20} />}>사용자 관리</NavItem>
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

      {/* ───────── 본문 ───────── */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 overflow-auto">
          {/* 헤더 */}
          <Header />

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <StatCard title="총 사용자 수" value={`${totalUsers}명`} />
            <StatCard title="최근 7일 신규 등록" value={`${newUsersCount}건`} />
          </div>

          {/* 사용자 테이블 */}
          <div className="p-4 bg-white rounded shadow">
            {loading ? (
              <p>로딩 중...</p>
            ) : (
              <UserTable users={users} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

/* ────────── 재사용 컴포넌트 ────────── */
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
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#000">
      <path d="M1.5 6.5A5.5 5.5 0 1 1 12.5 6.5 5.5 5.5 0 0 1 1.5 6.5Zm13 0A5 5 0 1 1 22.5 6.5 5 5 0 0 1 14.5 6.5Z" />
      <path d="M0 18a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4H0Zm14 0a6 6 0 0 1 2.53-4.9H20a4 4 0 0 1 4 4v4h-8Z" />
    </svg>
    <div>
      <h1 className="text-2xl font-semibold">사용자 관리</h1>
      <p className="text-sm text-gray-600">
        서비스 사용자를 한눈에 보고 관리하세요!
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

const UserTable = ({ users }) => (
  <table className="w-full border-collapse">
    <thead>
      <tr className="text-left">
        <Th>이름</Th>
        <Th>이메일</Th>
        <Th>전화번호</Th>
        <Th>ROLE</Th>
        <Th>가입일</Th>
      </tr>
    </thead>
    <tbody>
      {users.map((u) => (
        <tr key={u.id} className="border-t">
          <Td>{u.name}</Td>
          <Td>{u.email}</Td>
          <Td>{u.phone}</Td>
          <Td>{u.role}</Td>
          <Td>{u.createdAt?.split("T")[0]}</Td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Th = ({ children }) => (
  <th className="pb-2 font-semibold text-gray-700">{children}</th>
);
const Td = ({ children }) => <td className="py-2">{children}</td>;

export default UserManagementDashboard;
