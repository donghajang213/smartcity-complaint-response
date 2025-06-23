import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 유효성 검사
    if (!form.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("유효한 이메일 형식을 입력해주세요.");
      return;
    }

    if (!/^.{8,}$/.test(form.password)) {
      alert("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (!/^\d{10,11}$/.test(form.phone)) {
      alert("전화번호는 숫자만 입력해주세요. 예: 01012345678");
      return;
    }

    try {
      const result = await signup(form);
      alert("회원가입 성공!");
      setTimeout(() => {
        navigate("/login");
      }, 100);
    } catch (err) {
      alert("회원가입 실패");
      console.error("에러 발생:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">이름</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
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
              className="w-full border rounded px-3 py-2"
              placeholder="최소 8자 이상"
            />
          </div>

          <div>
            <label className="block mb-1">전화번호</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="숫자만 입력 (예: 01012345678)"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
