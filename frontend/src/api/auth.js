// src/api/auth.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const signup = async (formData) => {
  const response = await axios.post(`${BASE_URL}/api/signup`, formData);
  return response.data;
};

export const login = async (formData) => {
  const response = await axios.post(`${BASE_URL}/api/login`, formData);
  const token = response.data.token;
  localStorage.setItem("jwt", token); // 여기서 저장
  return response.data;
};
