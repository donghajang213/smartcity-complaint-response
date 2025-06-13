import { Link } from "react-router-dom";
import backgroundVideo from "../assets/854325-hd_1280_720_25fps.mp4";

export default function HeroSection() {
  return (
    <div className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      {/* 배경 비디오 */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={backgroundVideo}
        type="video/mp4"
      />

      {/* 영상 위 컨텐츠 */}
      <div className="relative z-10 max-w-3xl text-center px-6 bg-black bg-opacity-40 rounded-md">
        <h1 className="text-5xl font-extrabold mb-6">
          AI 챗봇으로 빠르고 정확한 답변을 경험하세요!
        </h1>
        <p className="text-lg mb-8">
          스마트시티 민원 응대를 위한 최신 AI 기술 기반의 자동화 서비스
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-3 px-6 rounded-md transition"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
