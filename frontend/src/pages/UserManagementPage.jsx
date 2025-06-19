// src/pages/UserManagementPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Wifi, LayoutDashboard } from 'lucide-react';

function UserManagementPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 인증 체크
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) navigate('/login');
  }, [navigate]);

  // 사용자 목록 호출 (관리자 전용)
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    axios.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data))
      .catch(err => console.error('사용자 데이터 불러오기 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  const totalUsers = users.length;
  const newUsersCount = users.filter(u => {
    const created = new Date(u.createdAt);
    const now = new Date();
    return (now - created) / (1000 * 60 * 60 * 24) <= 7;
  }).length;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold">관리자 대시보드</h2>
        <nav className="space-y-4">
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <LayoutDashboard size={20} /> 메인 대시보드
          </button>
          <button onClick={() => navigate('/admin/dashboard/users')} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Users size={20} /> 사용자 관리
          </button>
          <button onClick={() => navigate('/admin/dashboard/serverstatus')} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Wifi size={20} /> 서버 현황
          </button>
        </nav>
      </aside>

      {/* 본문 */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center mb-6">
          <Users size={48} className="text-gray-600" />
          <div className="ml-4">
            <h1 className="text-3xl font-semibold">사용자 관리</h1>
            <p className="text-gray-600">서비스의 사용자들을 한눈에 관리하세요.</p>
          </div>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-medium">총 사용자 수</h2>
            <p className="text-2xl font-bold mt-2">{totalUsers}명</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-medium">최근 7일 신규</h2>
            <p className="text-2xl font-bold mt-2">{newUsersCount}명</p>
          </div>
        </div>

        {/* 사용자 테이블 */}
        <div className="p-4 bg-white rounded shadow">
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="pb-2 font-semibold">이름</th>
                  <th className="pb-2 font-semibold">이메일</th>
                  <th className="pb-2 font-semibold">전화번호</th>
                  <th className="pb-2 font-semibold">역할</th>
                  <th className="pb-2 font-semibold">가입일</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t">
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.phone}</td>
                    <td className="py-2">{user.role}</td>
                    <td className="py-2">{user.createdAt.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
export default UserManagementPage;