import { Link } from "react-router-dom";
import backgroundImage from "../assets/backgroundimage.jpg";

export default function HeroSection() {
  return (
    <div className="relative h-screen flex items-start justify-center text-white overflow-hidden">

      {/* 배경 이미지 */}
      <img
        src={backgroundImage}
        alt="배경 이미지"
        className="absolute top-0 left-0 w-full h-full object-cover brightness-[0.4] z-0"
      />

      {/* 어두운 반투명 오버레이 */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-0" />

      {/* 콘텐츠 */}
      <div className="relative z-20 max-w-3xl text-center px-8 py-8
                bg-sky-200/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/20
                mt-12"
      >
        <h1 className="text-6xl font-extrabold mb-6 leading-tight text-white drop-shadow-lg">
          OneCityQ
        </h1>
        <p className="text-xl mb-10 text-white drop-shadow-md max-w-lg mx-auto leading-relaxed">
          민원, 날씨, 교통, 미세먼지까지<br />
          복잡한 정보, AI 챗봇으로 빠르고 쉽게 해결하세요.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 
                       rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-full
                      border-2 border-white shadow-lg
                      transition-all duration-300 ease-in-out"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
