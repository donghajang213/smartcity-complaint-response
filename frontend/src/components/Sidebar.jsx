// src/components/Sidebar.jsx
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ onNewChat }) {
  const nav = useNavigate();
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-50 border-r p-4 space-y-2">
      <button
      onClick={() => {
        onNewChat?.(); // 메시지 초기화 콜백
        nav('/chatbot'); // URL은 그대로 유지
      }}
      className='font-medium'
      >
        + New Chat
      </button>
      <hr />
      <button onClick={() => nav('/chatbot?tab=history')} className="text-left">History</button>
      <button onClick={() => nav('/chatbot?tab=favorites')} className="text-left">Favorites</button>
    </aside>
  );
}
