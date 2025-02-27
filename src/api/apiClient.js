import axios from "axios";

const BASE_URL = "http://localhost:8081/api";

// / Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// / 요청 시 자동으로 JWT 토큰 추가    
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 🔹 로컬스토리지에서 토큰 가져오기
    console.log("🔹 API 요청 - 토큰 포함 여부:", token ? "/ 있음" : "❌ 없음"); // 🔍 디버깅 로그
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 🔹 Authorization 헤더 추가
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
