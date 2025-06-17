import { useNavigate } from 'react-router-dom';

export default function Sidebar({ onNewChat, user }) {
  const nav = useNavigate();

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 bg-white border-r border-gray-200 p-4 shadow-sm">
      {/* 상단 메뉴 */}
      <div className="space-y-3">
        <button
          onClick={() => {
            onNewChat?.();
            nav('/chatbot');
          }}
          className="w-full text-left text-sm font-semibold text-black hover:text-neutral-600 transition"
        >
          + New Chat
        </button>
        <hr className="border-gray-200" />
        <button
          onClick={() => nav('/chatbot?tab=history')}
          className="w-full text-left text-sm text-neutral-700 hover:text-black transition"
        >
          History
        </button>
        <button
          onClick={() => nav('/chatbot?tab=favorites')}
          className="w-full text-left text-sm text-neutral-700 hover:text-black transition"
        >
          Favorites
        </button>
      </div>

      {/* 하단 업그레이드 버튼 */}
      {user?.role !== 'PRO' && (
        <div className="pt-4 border-t border-gray-200 mt-4">
          <button
            onClick={() => nav('/subscribe')}
            className="w-full px-4 py-2 border border-black text-black hover:bg-black hover:text-white rounded-md text-sm font-semibold transition duration-200"
          >
            업그레이드 하기
          </button>
        </div>
      )}
    </aside>
  );
}
