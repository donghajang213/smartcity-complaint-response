import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/auth.js';

export default function Header() {
  const nav = useNavigate();

  const [user, setUser] = useState({
    name: '',
    role: '',
  });

  // ✅ 마운트 시 프로필 정보 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/user/profile');
        console.log("profile response:", res.data);
        setUser({
          name: res.data.name || '게스트',
          role: res.data.role || 'FREE'
        });
      } catch (err) {
        console.warn('프로필 로드 실패', err);
        // 운영 시에는 로그인 페이지로 리디렉션
        nav('/login');
      }
    })();
  }, [nav]);

const logout = () => {
  // 1. 앱 JWT 제거
  localStorage.removeItem('jwt');

  // 2. Google 자동 로그인 세션 해제
  if (window.google?.accounts?.id) {
    window.google.accounts.id.disableAutoSelect();
  }

  // 3. 로그인 페이지로 이동
  nav('/login');
};


  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <Link to="/chatbot" className="text-2xl font-bold">
        MyChatService
      </Link>

      <div className="flex items-center space-x-6">
        {/* 사용자 이름 + 역할 */}
        {user.name && (
          <div className="text-gray-700">
            {user.name} ({user.role})
          </div>
        )}

        {/* 로그아웃 버튼 */}
        <button
          onClick={logout}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
