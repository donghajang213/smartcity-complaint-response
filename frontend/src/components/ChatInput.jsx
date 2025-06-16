// src/components/ChatInput.jsx
import { useState } from 'react';
import axios from '../api/auth.js'

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const send = async () => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    onSend(userMsg);
    setText('');
    try {
      const res = await axios.post('/api/chat', { text });
      onSend({ role: 'assistant', content: res.data.answer });
    } catch (e) {
      onSend({ role: 'assistant', content: '오류가 발생했습니다.' });
    }
  };

  return (
    <div className="flex items-center p-4 bg-white border-t">
      <textarea
        className="flex-1 border rounded p-2 h-10 resize-none"
        placeholder="메시지를 입력하세요..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key==='Enter' && !e.shiftKey && (e.preventDefault(), send())}
      />
      <button
        className="ml-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!text.trim()}
        onClick={send}
      >전송</button>
    </div>
  );
}
