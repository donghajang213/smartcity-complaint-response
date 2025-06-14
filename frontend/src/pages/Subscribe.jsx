import React from "react";
import { useNavigate } from "react-router-dom";

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

function Subscribe() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-6 relative">
      {/* ← 뒤로가기 버튼 */}
      <button
        onClick={() => navigate("/chatbot")}
        className="absolute top-6 left-6 text-gray-700 hover:text-black font-medium"
      >
        ← 뒤로가기
      </button>

      <div className="max-w-5xl w-full mx-auto flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Choose your plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-gray-50 rounded-2xl shadow-md p-8 border-2 transition-transform transform hover:scale-105 ${
                plan.isPopular ? "border-black" : "border-gray-200"
              }`}
            >
              {plan.isPopular && (
                <div className="text-xs text-white bg-black px-3 py-1 rounded-full inline-block mb-4 font-medium">
                  Most Popular
                </div>
              )}
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">{plan.name}</h2>
              <p className="text-3xl font-bold mb-4 text-gray-900">{plan.price}</p>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="mb-6 space-y-2 text-gray-700">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  plan.isPopular ? navigate("/pay") : navigate("/chatbot")
                }
                className={`w-full py-2 rounded-lg font-semibold transition-all duration-200 ${
                  plan.isPopular
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-white border border-gray-400 text-gray-800 hover:bg-gray-100"
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

export default Subscribe;
