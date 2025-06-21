// src/pages/ServerStatusPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsAPI } from '../api/auth.js';
import { Wifi, LayoutDashboard, Users } from 'lucide-react';
import ServerNetworkStatusChart from '../components/chart/ServerNetworkStatus';
import ServerUptimeChart        from '../components/chart/ServerUptime';

export default function ServerStatusPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  // 로그인 검사 & 데이터 로드
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/login');
      return;
    }
    StatsAPI.getServerStatus()
      .then(res => {
        console.log('받아온 서버 상태 데이터:', res.data);
        console.log("🔍 네트워크:", res.data.network);
        console.log("🔍 접속 정보:", res.data.connections);
        setStats(res.data);
  })
      .catch(err => console.error(
        '서버 상태 정보 불러오기 실패:',
        err.response?.data || err.message
      ));
  }, [navigate]);

  // 아직 데이터가 없으면 로딩 상태 보여주기
  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        서버 상태를 불러오는 중…
      </div>
    );
  }
  if (!stats || Object.keys(stats).length === 0) {
  return <div className="min-h-screen flex items-center justify-center">데이터가 없습니다.</div>;
}

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

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-8 overflow-auto">
        {/* 헤더 */}
        <div className="flex items-center mb-6">
          <Wifi size={48} className="text-gray-600" />
          <div className="ml-4">
            <h1 className="text-3xl font-semibold">서버 현황</h1>
            <p className="text-gray-600">
              서버의 상태를 한눈에 보고 진단해보세요!
            </p>
          </div>
        </div>

        {/* ✅ 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-medium">CPU 사용률</h2>
            <p className="text-2xl font-bold mt-2">
              {stats.cpuValue?.toFixed(2) ?? '—'}%
            </p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-medium">메모리 사용량</h2>
            <p className="text-2xl font-bold mt-2">
              {stats.memValue?.toFixed(2) ?? '—'}%
            </p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-medium">디스크 사용량</h2>
            <p className="text-2xl font-bold mt-2">
              {stats.diskValue?.toFixed(2) ?? '—'}%
            </p>
          </div>
        </div>

        {/* ✅ 네트워크 & 접속 현황 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-3">네트워크 현황</h2>
            <p>평균 접속자: {stats.network?.averageUsers ?? '—'}</p>
            <p>평균 응답 시간: {stats.network?.avgResponseMs ?? '—'} ms</p>
            <p>상태: {stats.network?.status ?? '—'}</p>
            <p>대역폭: 1 Gbps</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-3">현재 접속</h2>
            <p>총 접속자: {stats.connections?.current ?? '—'}</p>
            <p>메인 서버: {stats.connections?.main ?? '—'}</p>
            <p>프록시 서버: {stats.connections?.proxy ?? '—'}</p>
            <p>DB 서버: {stats.connections?.db ?? '—'}</p>
          </div>
        </div>

        {/* ✅ 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded shadow">
            <ServerNetworkStatusChart />
          </div>
          <div className="p-4 bg-white rounded shadow">
            <ServerUptimeChart />
          </div>
        </div>
      </main>
    </div>
  );
}