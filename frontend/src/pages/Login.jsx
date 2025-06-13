import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { login } from "../api/auth";
import { FcGoogle } from "react-icons/fc";
import { SiKakaotalk, SiNaver } from "react-icons/si";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(form);
      localStorage.setItem("jwt", result.token);
      alert("로그인 성공")
      navigate("/chatbot")
    } catch (err) {
      alert("로그인 실패");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-300">
      {/* 로그인 폼 영역 */}
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold"
          >
            로그인
          </button>
        </form>

        {/* SNS 로그인 */}
        <div className="mt-6">
          <p className="text-center text-gray-600 text-sm mb-3">또는 SNS 계정으로 로그인</p>
          <div className="space-y-2">
            <button className="flex items-center justify-center w-full border rounded py-2 shadow hover:bg-gray-100">
              <FcGoogle className="text-2xl mr-2" />
              <span>구글 계정으로 로그인</span>
            </button>
            <button className="flex items-center justify-center w-full bg-yellow-300 hover:bg-yellow-400 text-black py-2 rounded shadow">
              <SiKakaotalk className="text-xl mr-2" />
              <span>카카오 계정으로 로그인</span>
            </button>
            <button className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded shadow">
              <SiNaver className="text-xl mr-2" />
              <span>네이버 계정으로 로그인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
