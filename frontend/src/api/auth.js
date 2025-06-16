// src/api/auth.js
import axios from "axios";

// 개발환경에서만 BASE_URL 지정
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

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

// default export
export default axios;

