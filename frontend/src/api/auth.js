// src/api/auth.js

import axios from "axios";

// 개발환경에서만 BASE_URL 지정
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

console.log("✅ BASE_URL:", import.meta.env.VITE_API_BASE_URL);
console.log("axios baseURL:", axios.defaults.baseURL);

// 매 요청마다 JWT를 Authorization 헤더에 붙입니다.
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = async (formData) => {
  const { data } = await axios.post(`/api/signup`, formData);
  return data;
};

export const login = async (formData) => {
  const { data } = await axios.post(`/api/login`, formData);
  localStorage.setItem("jwt", data.token);
  return data;
};

export async function loginWithGoogle({ token }) {
  try {
    const response = await axios.post("/api/login/google", { token });
    return response.data; // { token: "JWT_토큰" }
  } catch (error) {
    console.error("Google 로그인 실패:", error.response?.data || error.message);
    throw error;
  }
}

//  [추가] 카카오 로그인
export const loginWithKakao = async (data) => {
  try {
    const response = await axios.post('/api/login/kakao', data);
    const token = response.data.token;
    if (token) {
      localStorage.setItem("jwt", token);
    } else {
      console.warn("카카오 로그인 응답에 token 없음:", response.data);
    }
    return response.data;
  } catch (error) {
    console.error("카카오 로그인 실패:", error.response?.data || error.message);
    throw error;
  }
};


//  [추가] 네이버 로그인
export const loginWithNaver = (data) => axios.post('/api/login/naver', data);

// default export
export default axios;