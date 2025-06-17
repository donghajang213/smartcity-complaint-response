// User_Management_DashBoard

import React, { useEffect, useState } from 'react';
import { Home, Users, Settings, Wifi, LayoutDashboard } from 'lucide-react';

const User_Management_DashBoard  = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error('서버 응답 오류');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('사용자 데이터를 불러오는 중 오류:', err);
        setLoading(false);
      });
  }, []);

  const totalUsers = users.length;
  const newUsersCount = users.filter(user => {
    const created = new Date(user.createdAt);
    const now = new Date();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold border-b" style={{ fontFamily: 'Pretendard-Regular' }}>
          관리자 대시보드
        </div>
        <nav className="p-4 space-y-4">
          <a href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <LayoutDashboard size={20} /> 메인 대시보드
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Users size={20} /> 사용자 관리
          </a>
          <a href="/dashboard/server_status" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Wifi size={20} /> 서버 현황
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Settings size={20} /> 설정
          </a>
          <a href="/chatbot" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Home size={20} /> 홈
          </a>
        </nav>
      </aside>

      {/* 본문 영역 */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 overflow-auto" style={{ fontFamily: 'Pretendard-Regular' }}>
          <div className="flex items-center space-x-2 mb-4 gap-1">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
              <path d="M1.5 6.5C1.5 3.46243 3.96243 1 7 1C10.0376 1 12.5 3.46243 12.5 6.5C12.5 9.53757 10.0376 12 7 12C3.96243 12 1.5 9.53757 1.5 6.5Z" fill="#000000" />
              <path d="M14.4999 6.5C14.4999 8.00034 14.0593 9.39779 13.3005 10.57C14.2774 11.4585 15.5754 12 16.9999 12C20.0375 12 22.4999 9.53757 22.4999 6.5C22.4999 3.46243 20.0375 1 16.9999 1C15.5754 1 14.2774 1.54153 13.3005 2.42996C14.0593 3.60221 14.4999 4.99966 14.4999 6.5Z" fill="#000000" />
              <path d="M0 18C0 15.7909 1.79086 14 4 14H10C12.2091 14 14 15.7909 14 18V22C14 22.5523 13.5523 23 13 23H1C0.447716 23 0 22.5523 0 22V18Z" fill="#000000" />
              <path d="M16 18V23H23C23.5522 23 24 22.5523 24 22V18C24 15.7909 22.2091 14 20 14H14.4722C15.4222 15.0615 16 16.4633 16 18Z" fill="#000000" />
            </svg>
            <div>
              <h1 className="text-2xl font-semibold mb-1">사용자 관리</h1>
              <p className="text-base font-normal">서비스의 사용자들을 클릭 한번으로 관리해보세요!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">총 사용자 수</h2>
              <p className="text-2xl font-bold mt-2">{totalUsers}명</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">신규 등록</h2>
              <p className="text-2xl font-bold mt-2">{newUsersCount}건</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded shadow">
            {loading ? (
              <p>로딩 중...</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left pb-2 font-semibold text-gray-700">이름</th>
                    <th className="text-left pb-2 font-semibold text-gray-700">이메일</th>
                    <th className="text-left pb-2 font-semibold text-gray-700">전화번호</th>
                    <th className="text-left pb-2 font-semibold text-gray-700">ROLE</th>
                    <th className="text-left pb-2 font-semibold text-gray-700">가입일자</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="py-2">{user.name}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">{user.phone}</td>
                      <td className="py-2">{user.role}</td>
                      <td className="py-2">{user.createdAt?.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default User_Management_DashBoard;
