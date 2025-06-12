// src/pages/Login.jsx
import { useState } from "react";
import { login } from "../api/auth"; // 로그인 API 함수가 있다고 가정

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await login(form); // 로그인 API 호출
    localStorage.setItem("jwt", result.token); // ✅ 토큰 저장
    alert("로그인 성공!");
    console.log("응답:", result);

    // 로그인 성공 후 리디렉션하고 싶다면 예: navigate("/dashboard")
  } catch (err) {
    alert("로그인 실패");
    console.error("에러:", err);
  }
};


  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">로그인</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">이메일</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">비밀번호</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          로그인
        </button>
      </form>
    </div>
  );
}

export default Login;
