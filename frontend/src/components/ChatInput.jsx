// src/components/ChatInput.jsx
import { useState } from 'react';
import axios from '../api/auth.js';

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
      // if (typeof response === 'string') {
      //   // 문자열 응답이면 그대로 출력
      //   assistantMsg = response;
      // } else if (response.results && response.results.length > 0) {
      //   // 여러 개의 응답 (날씨 + 미세먼지 + 버스 + 지하철) 처리
      //   response.results.forEach(result => {
      //     const apiResults = result.API_results;

      // 1) RAG 객체 형태로 올 경우, 순수 answer 문자열만 꺼내서 출력
      if (response && response.results && typeof response.results.answer === 'string') {
        assistantMsg = response.results.answer;
      }
      // 2) (기존) 배열 형태 legacy 응답 처리 로직
      else if (response && Array.isArray(response.results)) {
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
      }
      else {
        assistantMsg = '적절한 응답이 없습니다.';
      }

      onSend({ role: 'assistant', content: assistantMsg.trim() });
    } catch (e) {
      console.error('❌ 에러:', e);
      onSend({ role: 'assistant', content: '서버 오류가 발생했습니다.' });
    }
  };

  return (
    <div className="flex items-center p-4 bg-white border-t">
      <textarea
        className="flex-1 border rounded p-2 h-10 resize-none"
        placeholder="메시지를 입력하세요..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e =>
          e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())
        }
      />
      <button
        className="ml-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!text.trim()}
        onClick={send}
      >
        전송
      </button>
    </div>
  );
}
