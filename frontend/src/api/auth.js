// src/api/auth.js
import axios from "axios";

// BASE_URL 자체를 제거합니다.
export const signup = async (formData) => {
  const { data } = await axios.post(`/api/signup`, formData);
  return data;
};

export const login = async (formData) => {
  const { data } = await axios.post(`/api/login`, formData);
  localStorage.setItem("jwt", data.token);
  return data;
};
