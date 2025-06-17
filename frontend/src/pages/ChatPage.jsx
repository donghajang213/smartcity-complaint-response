import { useState } from 'react';
import { useLocation } from 'react-router-dom';      // ← 추가
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
// 히스토리·즐겨찾기용 컴포넌트가 있다면 import
// import HistoryList from '../components/HistoryList';
// import FavoritesList from '../components/FavoritesList';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const handleSend = msg => setMessages(prev => [...prev, msg]);
  const resetChat  = () => setMessages([]);

  // URL 쿼리 파라미터에서 ?tab=history or favorites 추출
  const { search } = useLocation();
  const tab = new URLSearchParams(search).get('tab');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onNewChat={resetChat} />

      <div className="flex-1 flex flex-col">
        <Header />

        {/* 탭에 따라 콘텐츠 분기 */}
        {tab === 'history' ? (
          /* 히스토리 리스트 보여주기 */
          <div className="p-4">
            {/* <HistoryList /> */}
            히스토리 목록 컴포넌트 자리
          </div>
        ) : tab === 'favorites' ? (
          /* 즐겨찾기 리스트 보여주기 */
          <div className="p-4">
            {/* <FavoritesList /> */}
            즐겨찾기 목록 컴포넌트 자리
          </div>
        ) : (
          /* 기본 채팅 UI */
          <>
            <ChatWindow messages={messages} />
            <ChatInput onSend={handleSend} />
          </>
        )}
      </div>
    </div>
  );
}
