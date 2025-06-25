// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/auth.js';
import { Home, Users, Settings, Wifi, LayoutDashboard } from 'lucide-react';
import TotalUsersChart from '../components/chart/TotalUsers.jsx';
import TodaysAccessorChart from '../components/chart/TodaysAccessor.jsx';
import NewRegistrationChart from '../components/chart/NewRegistration.jsx';

function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({ totalUsers: 0, todayVisitors: 0, newRegistrations: 0 });

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
       navigate('/login');
      return;
    }

    axios.get('/api/admin/dashboard/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDashboardData(res.data))
      .catch(err => console.error('대시보드 데이터 가져오기 실패:', err));
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-sky-300">
      <aside className="w-64 bg-white shadow-md p-6 space-y-8">
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
          <button onClick={() => navigate('/admin/dashboard/settings')} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Settings size={20} /> 설정
          </button>
          <button onClick={() => navigate('/main')} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Home size={20} /> 홈
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg max-w-5xl w-full space-y-6">
          <header className="flex items-center space-x-4 p-4 border-b">
            <LayoutDashboard size={48} />
            <div>
              <h1 className="text-3xl font-semibold">대시보드</h1>
              <p className="text-gray-600">모든 시스템을 손쉽게 관리해보세요!</p>
            </div>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="p-4 bg-sky-50 rounded shadow">
              <h2 className="text-lg font-medium">총 사용자 수</h2>
              <p className="text-2xl font-bold mt-2">{dashboardData.totalUsers.toLocaleString()}명</p>
            </div>
{/*             <div className="p-4 bg-sky-50 rounded shadow">
              <h2 className="text-lg font-medium">오늘의 접속자</h2>
              <p className="text-2xl font-bold mt-2">{dashboardData.todayVisitors.toLocaleString()}명</p>
            </div> */}
            <div className="p-4 bg-sky-50 rounded shadow">
              <h2 className="text-lg font-medium">신규 등록</h2>
              <p className="text-2xl font-bold mt-2">{dashboardData.newRegistrations.toLocaleString()}건</p>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="p-4 bg-sky-50 rounded shadow">
              <TotalUsersChart />
            </div>
            <div className="p-4 bg-sky-50 rounded shadow">
              <TodaysAccessorChart />
            </div>
            <div className="p-4 bg-sky-50 rounded shadow">
              <NewRegistrationChart />
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            <div className="p-4 bg-sky-50 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">서버 네트워크 현황</h2>
              <p>상태: 정상</p>
              <p>평균 트래픽: 120Mbps</p>
            </div>
            <div className="p-4 bg-sky-50 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">현재 서버 상태</h2>
              <p>메인 서버: 정상</p>
              <p>프록시 서버: 정상</p>
              <p>DB 서버: 정상</p>
              <button onClick={() => navigate('/admin/dashboard/serverstatus')} className="text-blue-700 mt-2">자세히 보기</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
export default AdminDashboard;
