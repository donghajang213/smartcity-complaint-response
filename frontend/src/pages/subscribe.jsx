import React, { useEffect, useState } from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Try ChatGPT for free.",
    features: ["Access to GPT-3.5", "Limited usage", "Basic features only"],
    isPopular: false,
  },
  {
    name: "Plus",
    price: "$20/mo",
    description: "Faster responses and access to GPT-4.5.",
    features: [
      "Access to GPT-4.5 (o4)",
      "Faster response speed",
      "Priority access to new features",
    ],
    isPopular: true,
  },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 감지
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);
  }, []);

  // 로그아웃 함수
  const handleLogout = async () => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("jwt");
        alert("로그아웃되었습니다.");
        window.location.href = "/"; // 홈으로 이동
      } else {
        const data = await response.json();
        alert(data.error || "로그아웃 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류로 로그아웃 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* 오른쪽 상단 로그아웃 버튼 */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          로그아웃
        </button>
      )}

      <div className="max-w-5xl w-full mx-auto flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-12">Choose your plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-8 border-2 ${
                plan.isPopular ? "border-blue-600" : "border-gray-200"
              }`}
            >
              {plan.isPopular && (
                <div className="text-sm text-white bg-blue-600 px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-3xl font-bold mb-4">{plan.price}</p>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-lg font-semibold ${
                  plan.isPopular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {plan.isPopular ? "Upgrade to Plus" : "Start for Free"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
