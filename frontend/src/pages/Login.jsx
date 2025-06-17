  import { useState, useRef, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { FcGoogle } from "react-icons/fc";
  import { SiKakaotalk } from "react-icons/si";
  import ReCAPTCHA from "react-google-recaptcha";
  import { GoogleLogin } from "@react-oauth/google";
  import { login, loginWithGoogle, loginWithKakao } from "../api/auth";

  function Login() {
    const [form, setForm] = useState({ email: "", password: "", recaptcha: "" });
    const recaptchaRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
      // ✅ 네이버 SDK 로드
      const naverScript = document.createElement("script");
      naverScript.src = "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js";
      naverScript.async = true;

      naverScript.onload = () => {
        const waitForNaver = setInterval(() => {
          if (window.naver && typeof window.naver.LoginWithNaverId === "function") {
            clearInterval(waitForNaver);

            const naverLogin = new window.naver.LoginWithNaverId({
              clientId: "7HH4OsDVfs1k77tgUvSw",
              callbackUrl: "http://localhost:5173/naver/callback/",
              isPopup: true,
              loginButton: { color: "green", type: 3, height: "47" },
              response_type: "token", // ✅ Implicit 방식
            });

            naverLogin.init();
          }
        }, 100);
      };
      document.body.appendChild(naverScript);

      // ✅ 카카오 SDK 로드 및 초기화
      const kakaoScript = document.createElement("script");
      kakaoScript.src = "https://developers.kakao.com/sdk/js/kakao.js";
      kakaoScript.async = true;

      kakaoScript.onload = () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init("8413a4aab24c3a25cc81eb161bcd7277"); // ✅ 실제 JavaScript 키
          console.log("✅ Kakao SDK Initialized");
        }
      };
      document.body.appendChild(kakaoScript);

      return () => {
        document.body.removeChild(naverScript);
        document.body.removeChild(kakaoScript);
      };
    }, []);

    // ✅ 기본 로그인
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!form.recaptcha) return alert("reCAPTCHA 인증을 완료해주세요.");

      try {
        const result = await login(form);
        localStorage.setItem("token", result.token);
        alert("로그인 성공!");
        navigate("/chatbot");
      } catch {
        alert("로그인 실패");
      } finally {
        if (recaptchaRef.current) recaptchaRef.current.reset();
      }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await loginWithGoogle({ token: credentialResponse.credential });
      localStorage.setItem("jwt", result.token);
      alert("구글 로그인 성공!");
      navigate("/chatbot");
    } catch {
      alert("구글 로그인 실패");
    }
  };

    // ✅ 카카오 로그인
    const handleKakaoLogin = () => {
      if (!window.Kakao) return alert("카카오 SDK 로드 실패");

      window.Kakao.Auth.login({
        scope: "account_email",
        success: async (authObj) => {
          try {
            const res = await loginWithKakao({ token: authObj.access_token });
            localStorage.setItem("token", res.token);
            alert("카카오 로그인 성공!");
            navigate("/chatbot");
          } catch (err) {
            console.error("카카오 로그인 실패", err);
            alert("카카오 로그인 실패");
          }
        },
        fail: (err) => {
          console.error("카카오 로그인 오류", err);
          alert("카카오 로그인 실패");
        },
      });
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-300">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">로그인</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="이메일"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6Ld1lmArAAAAAM0aJgY0SvFZ7GGTGwQPRIqFbJH0"
              onChange={(token) => setForm((prev) => ({ ...prev, recaptcha: token }))}
            />
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">
              로그인
            </button>
          </form>

          {/* ✅ SNS 로그인 영역 */}
          <div className="mt-6 space-y-2">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("구글 로그인 실패")} />

            <button
              onClick={handleKakaoLogin}
              className="w-full bg-yellow-300 py-2 rounded flex items-center justify-center"
            >
              <SiKakaotalk className="mr-2" /> 카카오 로그인
            </button>

            <div
              id="naverIdLogin"
              className="flex justify-center mt-2"
              style={{ minHeight: "48px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  export default Login;
