import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login, loginWithGoogle } from "../api/auth";
import { FcGoogle } from "react-icons/fc";
import { SiKakaotalk, SiNaver } from "react-icons/si";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recaptchaValue = recaptchaRef.current?.getValue();

    if (!recaptchaValue) {
      alert("reCAPTCHA를 확인해주세요.");
      return;
    }

  try {
    console.log("로그인 요청 데이터:", { ...form, recaptcha: recaptchaValue });  // ★ 여기에 찍기
    const result = await login({ ...form, recaptcha: recaptchaValue });
    console.log("로그인 응답 데이터:", result);  // ★ 성공했을 때 찍기
    localStorage.setItem("jwt", result.token);
    alert("로그인 성공!");
    navigate("/chatbot");
  } catch (err) {
    console.error("로그인 실패 에러:", err);  // ★ 실패했을 때 찍기
    alert("로그인 실패");
  }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await loginWithGoogle({ token: credentialResponse.credential });
      localStorage.setItem("jwt", result.token);
      alert("구글 로그인 성공!");
      navigate("/chatbot");
    } catch (err) {
      alert("구글 로그인 실패");
      console.error(err);
    }
  };

  const handleGoogleError = () => {
    alert("구글 로그인 중 오류가 발생했습니다.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-300">
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

          <div className="flex justify-center mt-3">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LdCH14rAAAAAEV6RMFJ8K11D9zzDoOvBBMHGyyD"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold mt-4"
          >
            로그인
          </button>
        </form>

        {/* SNS 로그인 */}
        <div className="mt-6">
          <p className="text-center text-gray-600 text-sm mb-3">또는 SNS 계정으로 로그인</p>
          <div className="space-y-2">
            {/* 구글 로그인 */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              render={renderProps => (
                <button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className={`flex items-center justify-center w-full border rounded py-2 shadow font-semibold
                    hover:bg-gray-100 transition-colors duration-200
                    ${renderProps.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  style={{
                    backgroundColor: 'white',
                    borderColor: '#d1d5db',
                    color: '#111827',
                  }}
                >
                  <FcGoogle className="text-2xl mr-2" />
                  <span>구글 계정으로 로그인</span>
                </button>
              )}
            />

            {/* 카카오 로그인 (미연동 상태 - 향후 구현 가능) */}
            <button className="flex items-center justify-center w-full bg-yellow-300 hover:bg-yellow-400 text-black py-2 rounded shadow">
              <SiKakaotalk className="text-xl mr-2" />
              <span>카카오 계정으로 로그인</span>
            </button>

            {/* 네이버 로그인 (미연동 상태 - 향후 구현 가능) */}
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
