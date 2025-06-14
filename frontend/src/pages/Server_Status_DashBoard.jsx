import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Home, Users, Settings, Wifi, LayoutDashboard } from 'lucide-react';
import Server_Network_Status from '../components/Chart/Server_Network_Status.jsx';
import Server_Uptime from '../components/Chart/Server_Uptime.jsx';

const App = () => {
  const [dashboardData, setDashboardData] = useState({ // 나중에 서버에서 편집 ㄱ
    totalUsers: 1245,
    todayVisitors: 320,
    newRegistrations: 15,
  });

  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  });

  useEffect(() => {
    axios.get('/user/profile') // 함수 만들어져 있어서 개꿀이네
      .then(response => {
        setUserProfile(response.data);
      })
      .catch(error => {
        console.error('프로필 정보 불러오기 실패:', error);
      });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold border-b" style={{ fontFamily: 'Pretendard-Regular' }}>관리자 대시보드</div>
        <nav className="p-4 space-y-4">
          <a href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <LayoutDashboard size={20} /> 메인 대시보드
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Users size={20} /> 사용자 관리
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Wifi size={20} /> 서버 현항
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
        {/* 헤더 */}

        {/* 콘텐츠 */}
        <main className="flex-1 p-6 overflow-auto" style={{ fontFamily: 'Pretendard-Regular' }}>
          <div>
  {/* 대시보드 헤더 */}
            <div className="flex items-center space-x-2 mb-4 gap-1">
              <svg width="50" height="50" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="m 8 1.992188 c -2.617188 0 -5.238281 0.933593 -7.195312 2.808593 l -0.496094 0.480469 c -0.3984378 0.378906 -0.410156 1.011719 -0.03125 1.410156 c 0.382812 0.398438 1.015625 0.410156 1.414062 0.03125 l 0.5 -0.476562 c 3.085938 -2.957032 8.53125 -2.957032 11.617188 0 l 0.5 0.476562 c 0.398437 0.378906 1.03125 0.367188 1.414062 -0.03125 c 0.378906 -0.398437 0.367188 -1.03125 -0.03125 -1.410156 l -0.496094 -0.484375 c -1.957031 -1.871094 -4.578124 -2.804687 -7.195312 -2.804687 z m -0.03125 4.007812 c -1.570312 0.011719 -3.128906 0.628906 -4.207031 1.8125 l -0.5 0.550781 c -0.179688 0.195313 -0.277344 0.453125 -0.261719 0.71875 c 0.011719 0.265625 0.128906 0.515625 0.328125 0.695313 c 0.195313 0.179687 0.453125 0.273437 0.71875 0.257812 c 0.265625 -0.011718 0.515625 -0.128906 0.695313 -0.328125 l 0.496093 -0.546875 c 1.277344 -1.402344 4.160157 -1.496094 5.523438 0.003906 l 0.5 0.542969 c 0.175781 0.199219 0.425781 0.316407 0.691406 0.328125 c 0.265625 0.015625 0.523437 -0.078125 0.722656 -0.257812 c 0.195313 -0.179688 0.3125 -0.429688 0.324219 -0.695313 c 0.011719 -0.261719 -0.082031 -0.523437 -0.261719 -0.71875 l -0.5 -0.546875 c -1.121093 -1.234375 -2.703125 -1.828125 -4.269531 -1.816406 z m 0.03125 4 c -0.511719 0 -1.023438 0.195312 -1.414062 0.585938 c -0.78125 0.78125 -0.78125 2.046874 0 2.828124 s 2.046874 0.78125 2.828124 0 s 0.78125 -2.046874 0 -2.828124 c -0.390624 -0.390626 -0.902343 -0.585938 -1.414062 -0.585938 z m 0 0" fill="#2e3436"/>
                </svg>
              <div>
                <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: 'Pretendard-Regular' }}>
                  서버 현항
                </h1>
                <h1 className="text-base font-normal" style={{ fontFamily: 'Pretendard-Regular' }}>
                  서버의 상태를 한눈에 보고 진단해보세요! 
                </h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">서버 CPU 사용률</h2>
              <p className="text-2xl font-bold mt-2">35%</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">서버 메모리 사용 비율</h2>
              <p className="text-2xl font-bold mt-2">8.4GB/16GB</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">서버 디스크 용량</h2>
              <p className="text-2xl font-bold mt-2">22GB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-semibold mb-2">서버 네트워크 현황</h2>
              <p>평균 접속자: {}</p>
              <p>평균 지원 시간 (m/s): {}</p>
              <p>서버 네트워크 상태: {}</p>
              <p>설정된 네트워크 대역폭: 1Gbps</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-semibold mb-2">서버 현황</h2>
              <p></p>
              <p>현재 접속자: {}</p>
              <p>메인 서버 상태: {}</p>
              <p>프록시 서버 상태: {}</p>
              <p>데이터베이스 서버 상태: {}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded shadow">
              <Server_Network_Status />
            </div>
            <div className="p-4 bg-white rounded shadow">
              <Server_Uptime />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
