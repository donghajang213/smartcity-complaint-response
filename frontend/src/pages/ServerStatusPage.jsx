// src/pages/ServerStatusPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wifi, LayoutDashboard } from 'lucide-react';
import ServerNetworkStatusChart from '../components/chart/ServerNetworkStatus.jsx';
import ServerUptimeChart from '../components/chart/ServerUptime.jsx';

function ServerStatusPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    cpuUsage: 0,
    memoryUsage: '',
    diskUsage: '',
    network: { averageUsers: 0, avgResponseMs: 0, status: '' },
    connections: { current: 0, main: '', proxy: '', db: '' },
    networkHistory: [],
    uptimeHistory: []
  });

  // 인증 체크
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) navigate('/login');
  }, [navigate]);

  // 서버 통계 호출
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    axios.get('/api/admin/serverstatus', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStats(res.data))
      .catch(err => console.error('서버 상태 정보 불러오기 실패:', err));
  }, []);

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

      <main className="flex-1 p-8 overflow-auto">
        {/* 헤더 */}
        <div className="flex items-center mb-6">
          <Wifi size={48} className="text-gray-600" />
          <div className="ml-4">
            <h1 className="text-3xl font-semibold">서버 현황</h1>
            <p className="text-gray-600">서버의 상태를 한눈에 보고 진단해보세요!</p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-medium">CPU 사용률</h2>
            <p className="text-2xl font-bold mt-2">{stats.cpuUsage}%</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-medium">메모리 사용량</h2>
            <p className="text-2xl font-bold mt-2">{stats.memoryUsage}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-medium">디스크 사용량</h2>
            <p className="text-2xl font-bold mt-2">{stats.diskUsage}</p>
          </div>
        </div>

        {/* 네트워크 & 접속 현황 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-3">네트워크 현황</h2>
            <p>평균 접속자: {stats.network.averageUsers}</p>
            <p>평균 응답 시간: {stats.network.avgResponseMs} ms</p>
            <p>상태: {stats.network.status}</p>
            <p>대역폭: 1 Gbps</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-3">현재 접속</h2>
            <p>총 접속자: {stats.connections.current}</p>
            <p>메인 서버: {stats.connections.main}</p>
            <p>프록시 서버: {stats.connections.proxy}</p>
            <p>DB 서버: {stats.connections.db}</p>
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded shadow">
            <ServerNetworkStatusChart data={stats.networkHistory} />
          </div>
          <div className="p-4 bg-white rounded shadow">
            <ServerUptimeChart data={stats.uptimeHistory} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ServerStatusPage;
