// import apiClient from "./apiClient";
import axios from "axios";

const BASE_URL = "http://localhost:8081/api/parts";


const API_BASE_URL = "http://localhost:8081/api";

//  Axios 인스턴스 생성
//  Axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Refresh Token을 사용해 새로운 Access Token 요청하는 함수
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  const username = localStorage.getItem("username");

  if (!refreshToken || !username) {
    console.warn(" Refresh Token 또는 Username 없음. 로그아웃 처리.");
    handleLogout();
    return null;
  }

  try {
    console.log(" Refresh Token 요청 시작...");
    const response = await axios.post(`${API_BASE_URL}/refresh`, { refreshToken, username });

    if (response.data.accessToken) {
      console.log(" 새로운 Access Token 받음:", response.data.accessToken);
      localStorage.setItem("token", response.data.accessToken);
      return response.data.accessToken;
    }
  } catch (error) {
    console.error("Refresh Token 요청 실패. 로그아웃 처리.");
    handleLogout();
    return null;
  }
}

//  로그아웃 처리 함수
function handleLogout() {
  console.warn("로그아웃 처리됨.");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "/";
}

//  요청 인터셉터: 모든 API 요청 전에 실행됨
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  응답 인터셉터: 403 발생 시 Refresh Token 요청 후 Access Token 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 403) {
      console.warn("403 Forbidden 발생! Refresh Token으로 새 Access Token 요청 시도.");

      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        console.error("Refresh Token도 만료됨. 로그아웃 처리.");
        handleLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// / 부품 목록 조회
export const fetchParts = async (params) => {
  try{
    const response = await api.get("", { params });
    return response.data;
  }catch(error){
    return handleApiError(error);
  }
  
};

// / 특정 부품 조회
export const getPartById = async (id) => {
  try{
    const response = await api.get(`/${id}`);
    return response.data;
  }catch(error){
    return handleApiError(error);
  }
};

// 시리얼 넘버 조회
export const getSerialNUmber = async (serialNumber) => {
  try{
    const response = await api.get(`/isSerialNumberAvailable/${serialNumber}`);
    if (response.data.result === "CONFIRMED") {
      return { success: true, message: "중복" };
    } else {
      return { success: false, message: "부품 수정에 실패했습니다. 다시 시도하세요." };
    }
  }catch(error){
    return handleApiError(error); 
  }
 
};

// / 부품 등록
export const createPart = async (partData) => {
  try {
    const response = await api.post(`/register`, partData);
    
    if (response.data.result === "DUPLICATED") {
      return { success: false, message: "시리얼 번호가 중복되었습니다. 다시 입력해주세요." };
    } else if(response.data.result === "INSERT_COMPLETE"){
      return { success: true, message: "부품이 성공적으로 등록되었습니다!" };
    }else{
      return { success: false, message: "부품 등록에 실패했습니다. 다시 시도하세요." };
    }
  } catch (error) {
    return handleApiError(error); 
  }
};

// / 부품 수정
export const updatePart = async (partData) => {
  try {
    const response = await api.put(`/updatePart`, partData);
    if (response.data.result === "UPDATE_COMPLETE") {
      return { success: true, message: "부품이 성공적으로 수정되었습니다!" };
    } else {
      return { success: false, message: "부품 수정에 실패했습니다. 다시 시도하세요." };
    }
  } catch (error) {
    return handleApiError(error); 
  }
};

// / 부품 삭제
export const deletePart = async (id) => {
  try {
    const response = await api.put(`/delete/${id}`);

    if (response.data.result === "DELETE_COMPLETE") {
      return { success: true, message: "부품이 성공적으로 삭제되었습니다!" };
    } else {
      return { success: false, message: "부품 삭제에 실패했습니다. 다시 시도하세요." };
    }
  } catch (error) {
    // return { success: false, message: "서버 오류가 발생했습니다." };
    return handleApiError(error); 
  }
};

// / `asset_id = NULL`인 부품 조회
export const fetchUnassignedParts = async () => {
  try{
    const response = await api.get(`/unassigned`);
    return response.data;
  }catch(error){
    return handleApiError(error); 
  }
  
  
};

// 공통 API 에러 핸들링
const handleApiError = async (error) => {
  if (error.response && error.response.status === 403) {
    console.warn("API 요청 중 403 오류 발생! Refresh Token 요청.");
    try {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        return api.request(error.config);
      }
    } catch (refreshError) {
      console.error("❌ Refresh Token도 만료됨. 로그아웃 처리.");
      handleLogout();
    }
  }
  return { success: false, message: "서버 오류가 발생했습니다." };
};
