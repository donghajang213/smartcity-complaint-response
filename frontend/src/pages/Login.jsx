import { useState, useRef, useEffect } from "react";
import { login, loginWithGoogle } from "../api/auth";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const recaptchaRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 페이지 로드 시 JWT 토큰 있으면 로그인 상태로 설정
  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setIsLoggedIn(true);
    }
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

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
      const result = await login({ ...form, recaptcha: recaptchaValue });
      localStorage.setItem("jwt", result.token);
      setIsLoggedIn(true);
      alert("로그인 성공!");
    } catch (err) {
      alert("로그인 실패");
      console.error(err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await loginWithGoogle({ token: credentialResponse.credential });
      localStorage.setItem("jwt", result.token);
      setIsLoggedIn(true);
      alert("구글 로그인 성공!");
    } catch (err) {
      alert("구글 로그인 실패");
      console.error(err);
    }
  };

  const handleGoogleError = () => {
    alert("구글 로그인 중 오류가 발생했습니다.");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-300 p-4">
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">로그인</h2>

        {isLoggedIn ? (
          <div className="text-center">
            <p className="mb-4 text-lg text-gray-700">로그인 상태입니다.</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <>
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

            <div className="mt-6">
              <p className="text-center text-gray-600 text-sm mb-3">또는 구글 계정으로 로그인</p>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  size="large"
                  shape="circle"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
