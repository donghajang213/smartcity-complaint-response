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
        // nav('/login');
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
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      <Link to="/chatbot" className="text-xl font-bold text-blue-600 hover:opacity-80 transition">
        💬 MyChatService
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {user.name && (
          <span className="text-gray-600 font-medium">
            {user.name} <span className="text-gray-400">({user.role})</span>
          </span>
        )}
        <button
          onClick={logout}
          className="text-gray-500 hover:text-red-500 transition font-medium"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
