// src/components/ChatWindow.jsx
export default function ChatWindow({ messages }) {
  return (
    <div className="flex-1 overflow-auto p-4 space-y-4 flex flex-col">
      {messages.length === 0 ? (
        <div className="text-gray-500 italic">새로운 대화를 시작해 보세요.</div>
      ) : (
        messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-lg p-3 rounded-lg whitespace-pre-wrap shadow ${
              msg.role === 'user'
                ? 'bg-blue-100 self-end text-right'
                : 'bg-gray-200 self-start text-left'
            }`}
          >
            {msg.content}
          </div>
        ))
      )}
    </div>
  );
}
