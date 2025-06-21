// src/pages/ChatPage.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import AdBanner from '../components/AdBanner';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const handleSend = msg => setMessages(prev => [...prev, msg]);
  const resetChat = () => setMessages([]);
  const user = { role: 'FREE' }; // 예시

  const { search } = useLocation();
  const tab = new URLSearchParams(search).get('tab');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바: 고정 폭, 그림자 */}
      <div className="w-64 flex flex-col bg-white border-r shadow-md">
        <Sidebar onNewChat={resetChat} user={user} />
      </div>

      {/* 왼쪽 광고: 배경+패딩 */}
      <div className="w-40 bg-white flex items-center justify-center p-4">
        <div className="border rounded-lg overflow-hidden shadow-sm w-full h-full">
          <AdBanner position="chat-left"   limit={1} />     // 채팅 좌측
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {tab === 'history' ? (
            <div className="p-6 overflow-auto w-full bg-white">
              {/* <HistoryList /> */}
              히스토리 목록
            </div>
          ) : tab === 'favorites' ? (
            <div className="p-6 overflow-auto w-full bg-white">
              {/* <FavoritesList /> */}
              즐겨찾기 목록
            </div>
          ) : (
            <div className="flex flex-col h-full w-full bg-white">
              <div className="flex-1 overflow-auto p-6">
                <ChatWindow messages={messages} />
              </div>
              <div className="border-t p-4 bg-gray-50">
                <ChatInput onSend={handleSend} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽 광고 */}
      <div className="w-40 bg-white flex items-center justify-center p-4">
        <div className="border rounded-lg overflow-hidden shadow-sm w-full h-full">
          <AdBanner position="chat-right"  limit={1} />     // 채팅 우측
        </div>
      </div>
    </div>
  );
}
