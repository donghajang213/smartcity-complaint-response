// src/components/ChatWindow.jsx
export default function ChatWindow({ messages }) {
  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-gray-500 italic">새로운 대화를 시작해 보세요.</div>
      ) : messages.map((msg, i) => (
        <div key={i} className={`p-2 rounded ${msg.role==='user'?'bg-blue-100 self-end':'bg-gray-100 self-start'}`}>
          {msg.content}
        </div>
      ))}
    </div>
  );
}
