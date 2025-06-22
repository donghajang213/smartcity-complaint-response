import { useNavigate } from 'react-router-dom';
import AdBanner from './AdBanner';
import { Plus, Clock, Star, Rocket } from 'lucide-react'; // 아이콘 라이브러리 (lucide-react)

export default function Sidebar({ onNewChat, user }) {
  const nav = useNavigate();

  return (
    <div className="flex flex-col justify-between h-full px-5 py-6 bg-white border-r shadow-md">
      {/* ✅ 상단 메뉴 */}
      <div className="space-y-5">
        <button
          onClick={() => {
            onNewChat?.();
            nav('/chatbot');
          }}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          새 채팅 시작
        </button>

        <div className="space-y-2 text-sm">
          <button
            onClick={() => nav('/chatbot?tab=history')}
            className="w-full flex items-center gap-2 text-left px-2 py-2 hover:bg-gray-100 rounded-md transition"
          >
            <Clock size={16} className="text-blue-500" />
            히스토리
          </button>
          <button
            onClick={() => nav('/chatbot?tab=favorites')}
            className="w-full flex items-center gap-2 text-left px-2 py-2 hover:bg-gray-100 rounded-md transition"
          >
            <Star size={16} className="text-yellow-500" />
            즐겨찾기
          </button>
        </div>
      </div>
{/* 왼쪽 하단 광고 */}
        <div className="relative w-full h-28 border rounded-xl overflow-hidden shadow-md bg-gray-50">
          <div className="absolute top-2 left-2 text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
            광고
          </div>
          <AdBanner position="chat-left-bottom" limit={1} />
        </div>
      {/* ✅ 하단 영역 */}
      <div className="space-y-4 pt-6 border-t border-gray-200 mt-6">
        {/* 업그레이드 버튼 (PRO 전용) */}
        {user?.role !== 'PRO' && (
          <button
            onClick={() => nav('/subscribe')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md text-sm font-semibold hover:opacity-90 transition shadow"
          >
            <Rocket size={16} />
            PRO 업그레이드
          </button>
        )}

        
      </div>
    </div>
  );
}
