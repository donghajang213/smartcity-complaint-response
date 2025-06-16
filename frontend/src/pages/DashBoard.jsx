import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Home, Users, Settings, Wifi, LayoutDashboard } from 'lucide-react';
import Total_users from '../components/Chart/Total_users.jsx';
import Todays_Accessor from '../components/Chart/Todays_Accessor.jsx';
import New_Registration from '../components/Chart/New_Registration.jsx';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayVisitors, setTodayVisitors] = useState(0); // 일단 임시로 유지

  useEffect(() => {
    // 1. 사용자 목록 가져오기
    axios.get('/api/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('사용자 데이터를 불러오는 중 오류:', err);
        setLoading(false);
      });

    // 2. 오늘 접속자 수 가져오기
    axios.get('/api/users/today-visitors')
      .then(res => {
        setTodayVisitors(res.data.count);  // 백엔드에서 count 필드로 응답받음
      })
      .catch(err => {
        console.error('오늘 접속자 수를 불러오는 중 오류:', err);
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
        <div className="p-4 text-xl font-bold border-b" style={{ fontFamily: 'Pretendard-Regular' }}>관리자 대시보드</div>
        <nav className="p-4 space-y-4">
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
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
          {/* 대시보드 헤더 */}
          <div className="flex items-center space-x-2 mb-4">
            <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#222">
              <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>
            <div className="gap-1">
              <h1 className="text-2xl font-semibold mb-1">대시보드</h1>
              <h1 className="text-base font-normal">모든 시스템을 손쉽게 관리해보세요!</h1>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">총 사용자 수</h2>
              <p className="text-2xl font-bold mt-2">{totalUsers.toLocaleString()}명</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">오늘의 접속자</h2>
              <p className="text-2xl font-bold mt-2">{todayVisitors.toLocaleString()}명</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">신규 등록</h2>
              <p className="text-2xl font-bold mt-2">{newUsersCount.toLocaleString()}건</p>
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-white rounded shadow">
              <Total_users users={users} />
            </div>
            <div className="p-4 bg-white rounded shadow">
              <Todays_Accessor />
            </div>
            <div className="p-4 bg-white rounded shadow">
              <New_Registration users={users} />
            </div>
          </div>

          {/* 서버 상태 요약 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-semibold mb-2">서버 네트워크 현황</h2>
              <p>서버 네트워크 상태: {}</p>
              <p>평균 트래픽: {}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-semibold mb-2">현재 서버 상태</h2>
              <p>메인 서버 상태: {}</p>
              <p>프록시 서버 상태: {}</p>
              <p>데이터베이스 서버 상태: {}</p>
              <a href='/dashboard/server_status' className='text-blue-700'>자세히 보기</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
