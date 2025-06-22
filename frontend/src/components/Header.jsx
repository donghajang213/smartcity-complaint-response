import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/auth.js';

export default function Header() {
  const nav = useNavigate();

  const [user, setUser] = useState({
    name: '',
    role: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('token 없음');

        // ✅ 현재 로그인한 사용자 정보 가져오기
        const res = await axios.get('/api/user/profile');

        setUser({
          name: res.data.name,
          role: res.data.role
        });
      } catch (err) {
        console.warn('사용자 정보 로드 실패', err);
        nav('/login');
      }
    })();
  }, [nav]);

  const logout = () => {
    localStorage.removeItem('jwt');
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    nav('/login');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <Link to="/chatbot" className="text-2xl font-bold">
        MyChatService
      </Link>

      <div className="flex items-center space-x-6">
        {user.name && (
          <div className="text-gray-700">
            {user.name} ({user.role})
          </div>
        )}
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
