import { useState } from "react";
import { signup } from "../api/auth";

const mbtiOptions = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

const departmentOptions = [
  "경영학과", "경제학과", "컴퓨터공학과", "소프트웨어학과", "의학과", "간호학과", "심리학과", "사회학과",
  "정치외교학과", "법학과", "전자공학과", "기계공학과", "산업공학과", "화학공학과", "토목공학과", "건축학과",
  "영어영문학과", "국어국문학과", "수학과", "물리학과", "화학과", "생명과학과", "체육학과", "교육학과",
  "철학과", "중어중문학과", "일어일문학과", "사학과", "항공우주공학과", "바이오공학과",
];

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    mbti: "",
    grade: "",
    stdNum: "",
    department: "",
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
      const result = await signup(form);
      alert("회원가입 성공!");
      console.log("백엔드 응답:", result);
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
          {/* 이름 */}
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

          {/* 이메일 */}
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

          {/* 비밀번호 */}
          <div>
            <label className="block mb-1">비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block mb-1">전화번호</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* MBTI 선택 */}
          <div>
            <label className="block mb-1">MBTI</label>
            <select
              name="mbti"
              value={form.mbti}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">선택하세요</option>
              {mbtiOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* 학년 */}
          <div>
            <label className="block mb-1">학년</label>
            <input
              type="number"
              name="grade"
              value={form.grade}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* 학번 */}
          <div>
            <label className="block mb-1">학번</label>
            <input
              type="number"
              name="stdNum"
              value={form.stdNum}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* 학과 선택 */}
          <div>
            <label className="block mb-1">학과</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">선택하세요</option>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* 제출 버튼 */}
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
