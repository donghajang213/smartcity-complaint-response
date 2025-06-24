// src/api/auth.js
import axios from 'axios';

// 개발 모드인지 체크
const isDev = import.meta.env.MODE === 'development';

// dev: proxy 우선 (빈 문자열), prod: 실제 도메인
const API_BASE = isDev
  ? ''  
  : import.meta.env.VITE_API_ORIGIN;

// axios 기본 설정
axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;  // 쿠키 전송이 필요하면

// 요청 시 JWT 자동 첨부
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 회원가입
export const signup = async (formData) => {
  const { data } = await axios.post('/api/signup', formData);
  return data;
};

// 일반 로그인
export const login = async (formData) => {
  const { data } = await axios.post('/api/login', formData);
  localStorage.setItem("jwt", data.token);
  return data;
};

// Google 로그인
export async function loginWithGoogle({ token }) {
  try {
    const response = await axios.post('/api/login/google', { token });
    localStorage.setItem("jwt", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Google 로그인 실패:", error.response?.data || error.message);
    throw error;
  }
}

// Kakao 로그인
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

// Naver 로그인
export const loginWithNaver = (data) =>
  axios.post('/api/login/naver', data);

// 통계 API 모음
export const StatsAPI = {
  getServerStatus:     () => axios.get('/api/admin/serverstatus'),
  getNetworkHistory:   () => axios.get('/api/admin/stats/server-network'),
  getUptimeHistory:    () => axios.get('/api/admin/stats/server-uptime'),
  getNewRegistrations: () => axios.get('/api/admin/stats/new-registrations'),
  getTotalUsers:       () => axios.get('/api/admin/dashboard/total-users'),
  getTodayAccessors:   () => axios.get('/api/admin/stats/today-accessors'),
};

// 광고 API
export const AdsAPI = {
  getAdsByPosition: (position, limit = 3) =>
    axios.get('/api/ads/position', { params: { position, limit } }),

  incrementClick: id =>
    axios.post(`/api/ads/click/${id}`),

  getAds:        () => axios.get('/api/admin/ads'),
  uploadAd:      fd => axios.post('/api/admin/ads/upload', fd),
  deleteAd:      id => axios.delete(`/api/admin/ads/${id}`),
  reorderAds:    ads => axios.post('/api/admin/ads/reorder', { ads }),
  toggleStatus:  en  => axios.post('/api/admin/ads/toggle', { enabled: en }),
  getStatus:     ()  => axios.get('/api/admin/ads/status'),
};

// 기본 axios export
export default axios;
