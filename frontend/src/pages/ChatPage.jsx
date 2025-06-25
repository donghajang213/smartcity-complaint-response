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
  const handleSend = (msg) => {
    setMessages(prev => {
      if (msg.replaceId) {
        return prev.map(m =>
          m.id === msg.replaceId
            ? { ...msg, id: msg.replaceId }
            : m
        );
      }
      const id = msg.id || Date.now();
      return [...prev, { ...msg, id }];
    });
  };

  const resetChat = () => setMessages([]);
  const user = { role: 'FREE' };

  const { search } = useLocation();
  const tab = new URLSearchParams(search).get('tab');

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* 사이드바 */}
      <aside className="w-64 bg-white border-r shadow-md hidden md:flex flex-col">
        <Sidebar onNewChat={resetChat} user={user} />
      </aside>

     

      {/* 메인 영역 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-hidden">
          {tab === 'history' ? (
            <div className="p-6 overflow-auto h-full bg-white">
              히스토리 목록
            </div>
          ) : tab === 'favorites' ? (
            <div className="p-6 overflow-auto h-full bg-white">
              즐겨찾기 목록
            </div>
          ) : (
            <div className="flex flex-col h-full bg-white">
              <div className="flex-1 overflow-auto p-6">
                <ChatWindow messages={messages} />
              </div>
              <ChatInput onSend={handleSend} />
            </div>
          )}
        </div>
      </main>

      {/* 우측 광고 */}
      <div className="w-40 bg-white hidden lg:flex items-center justify-center p-4 border-l">
        <div className="border rounded-lg overflow-hidden shadow w-full h-full bg-gray-50">
          <AdBanner position="chat-right" limit={1} />
        </div>
      </div>
    </div>
  );
}
