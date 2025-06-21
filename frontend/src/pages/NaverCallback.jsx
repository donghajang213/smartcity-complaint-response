import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithNaver } from "../api/auth"; // 백엔드 요청 함수

function NaverCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1)); // 🔥 '#' 제거 후 파싱
    const accessToken = hashParams.get("access_token");

    console.log("🧪 access_token:", accessToken); // 이게 안 나오면 parsing 실패

    if (!accessToken) {
      alert("네이버 로그인 실패 (access_token 없음)");
      return;
    }

    (async () => {
      try {
        const res = await loginWithNaver({ token: accessToken });
        localStorage.setItem("jwt", res.token);
        alert("네이버 로그인 성공!");
        navigate("/chatbot");
      } catch (err) {
        console.error("네이버 로그인 실패", err);
        alert("네이버 로그인 실패");
      }
    })();
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}

export default NaverCallback;
