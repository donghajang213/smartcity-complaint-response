import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.jpg";

const tabs = ["자유게시판", "핫게시판", "시간표", "소개팅" ,"공지 사항" , "QnA" ];

const notice = "🎉 UniVerse에 오신 것을 환영합니다! 최신 소식과 공지를 확인하세요.";

const trendingPosts = [
  { id: 1, title: "중간고사 언제임?", board: "자유게시판", comments: 5, likes: 12 },
  { id: 2, title: "오늘 밥 뭐 먹지?", board: "핫게시판", comments: 2, likes: 3 },
  { id: 3, title: "수업 자료 공유합니다!", board: "자유게시판", comments: 8, likes: 21 },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { from: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" },
  ]);
  const [input, setInput] = React.useState("");

  const toggleChat = () => setIsOpen((prev) => !prev);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);

    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "선아 바보 아니야! 😅" },
      ]);
    }, 1000);

    setInput("");
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition"
        aria-label="챗봇 열기/닫기"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 max-w-full bg-white rounded-lg shadow-lg flex flex-col">
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-t-lg font-semibold">
            UniVerse 챗봇
          </div>
          <div className="flex-1 p-4 overflow-y-auto h-64 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.from === "bot" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[70%] ${
                    msg.from === "bot"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex border-t border-gray-300 p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="메시지를 입력하세요..."
              className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white px-4 rounded-r hover:bg-indigo-700 transition"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const MainPage = () => {
  const [selectedTab, setSelectedTab] = React.useState("자유게시판");

  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 바 */}
      <header className="flex items-center justify-between bg-white shadow px-8 py-4">
        {/* 왼쪽 로고 */}
        <div className="flex items-center space-x-3" style={{ minWidth: "220px" }}>
          <img
            src={logoImage}
            alt="UniVerse 로고"
            className="w-16 h-16 object-contain"
          />
          <span className="text-4xl font-extrabold text-indigo-700 select-none">
            UniVerse
          </span>
        </div>

        {/* 중앙 네비게이션 */}
        <nav className="flex space-x-20 text-2xl font-semibold text-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`hover:text-indigo-600 transition ${
                selectedTab === tab ? "text-indigo-600 border-b-4 border-indigo-600" : ""
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* 오른쪽 로그인/회원가입 */}
        <div className="flex space-x-6 text-lg">
          <Link
            to="/login"
            className="text-indigo-600 border border-indigo-600 px-4 py-1 rounded hover:bg-indigo-50 transition"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="text-green-600 border border-green-600 px-4 py-1 rounded hover:bg-green-50 transition"
          >
            회원가입
          </Link>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-grow max-w-[1280px] mx-auto px-6 py-10 space-y-16 w-full">
        {/* 공지사항 */}
        <section className="bg-indigo-100 text-indigo-800 p-4 rounded-md font-semibold text-center shadow">
          {notice}
        </section>

        {/* 주요 게시판 바로가기 */}
        <section>
          <h2 className="text-3xl font-bold mb-8">주요 게시판 바로가기</h2>
          <div className="grid grid-cols-5 gap-10 text-center">
            {[
              { name: "자유게시판", to: "/freeboard", icon: "💬" },
              { name: "시간표", to: "/timetable", icon: "📅" },
              { name: "핫게시판", to: "/hot", icon: "🔥" },
              { name: "소개팅", to: "/dating", icon: "💖" },
              { name: "공지사항", to: "/notice", icon: "📢" },
            ].map(({ name, to, icon }) => (
              <Link
                key={name}
                to={to}
                className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="text-6xl mb-4">{icon}</div>
                <div className="text-xl font-semibold">{name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* 오늘의 인기 게시글 */}
        <section>
          <h2 className="text-3xl font-bold mb-8">오늘의 인기 게시글</h2>
          <ul className="space-y-5">
            {trendingPosts.map(({ id, title, board, comments, likes }) => (
              <li
                key={id}
                className="bg-white p-5 rounded-lg shadow hover:bg-indigo-50 transition cursor-pointer"
              >
                <Link to={`/${board.toLowerCase()}/post/${id}`} className="flex justify-between items-center">
                  <span className="font-semibold text-indigo-700 text-lg">{title}</span>
                  <div className="text-sm text-gray-500 space-x-6">
                    <span>💬 {comments}</span>
                    <span>❤️ {likes}</span>
                  </div>
                </Link>
                <div className="text-xs text-gray-400 mt-1">{board}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* 시간표 요약 */}
        <section className="bg-white p-8 rounded-lg shadow max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">내 시간표 미리보기</h2>
          <p className="text-gray-700 mb-6">
            로그인 후 시간표 기능을 사용할 수 있습니다.
          </p>
          <Link
            to="/timetable"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded hover:bg-indigo-700 transition font-semibold"
          >
            시간표 바로가기
          </Link>
        </section>

        {/* 소개팅 최신 글 */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">소개팅 최신 글</h2>
          <ul className="space-y-4">
            <li className="bg-white p-5 rounded-lg shadow hover:bg-pink-50 transition cursor-pointer">
              <Link to="/dating/post/10" className="font-semibold text-pink-600 text-lg">
                6월 소개팅 모임 같이 할 사람?
              </Link>
            </li>
            <li className="bg-white p-5 rounded-lg shadow hover:bg-pink-50 transition cursor-pointer">
              <Link to="/dating/post/12" className="font-semibold text-pink-600 text-lg">
                이번 학기 소개팅 후기 공유해요!
              </Link>
            </li>
          </ul>
        </section>
      </main>

      {/* 오른쪽 하단 챗봇 */}
      <Chatbot />
    </div>
  );
};

export default MainPage;
