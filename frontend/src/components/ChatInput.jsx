import { useState } from 'react';
import axios from '../api/auth.js';
import { Send } from 'lucide-react'; // 아이콘 추가(optional)

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const send = async () => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    onSend(userMsg);
    setText('');

    try {
      const res = await axios.post('/api/chat', { message: text });
      const response = res.data.answer;

      let assistantMsg = '';

      if (response && response.results && typeof response.results.answer === 'string') {
        assistantMsg = response.results.answer;
      } else if (response && Array.isArray(response.results)) {
        response.results.forEach(result => {
          const apiResults = result.API_results;
          if (!Array.isArray(apiResults)) return;

          apiResults.forEach(section => {
            if (section.type === '날씨') {
              assistantMsg += '🌤 날씨 정보:\n';
              assistantMsg += section.data
                .map(row => `${row.fcstTime} ${row.category_ko}: ${row.fcstValue}`)
                .join('\n') + '\n\n';
            } else if (section.type === '미세먼지') {
              assistantMsg += '🌫 미세먼지 정보:\n';
              assistantMsg += section.data
                .map(row => `${row.local} ${row.dust_type}: ${row.dust_value}`)
                .join('\n') + '\n\n';
            } else if (section.type === '버스') {
              assistantMsg += '🚌 버스 도착 정보:\n';
              assistantMsg += section.data
                .map(row => `${row.bus_number}번 버스 - ${row.arrival_message}`)
                .join('\n') + '\n\n';
            } else if (section.type === '지하철') {
              assistantMsg += '🚇 지하철 도착 정보:\n';
              assistantMsg += section.data
                .map(row => `${row.trainLineNm} - ${row.arvlMsg2}`)
                .join('\n') + '\n\n';
            }
          });
        });
      } else {
        assistantMsg = '적절한 응답이 없습니다.';
      }

      onSend({ role: 'assistant', content: assistantMsg.trim() });
    } catch (e) {
      console.error('❌ 에러:', e);
      onSend({ role: 'assistant', content: '서버 오류가 발생했습니다.' });
    }
  };

  return (
    <div className="w-full px-4 py-6 bg-white border-t border-gray-200">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <textarea
          className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          rows={1}
          placeholder="메시지를 입력하세요..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e =>
            e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())
          }
        />
        <button
          onClick={send}
          disabled={!text.trim()}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-40"
        >
          <Send size={20} className="transform rotate-[320deg]" />
        </button>
      </div>
    </div>
  );
}
