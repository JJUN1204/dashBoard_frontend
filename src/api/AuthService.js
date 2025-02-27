import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });

    if (response.data.accessToken && response.data.refreshToken) {
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("username", username); // ✅ username 저장

      console.log("✅ 로그인 성공! 저장된 Username:", username);
      return { success: true, message: "로그인 성공!" };
    } else {
      return { success: false, message: "로그인 실패. 다시 시도해주세요." };
    }
  } catch (error) {
    console.error("❌ 로그인 요청 실패:", error);
    return { success: false, message: "서버 오류가 발생했습니다." };
  }
};

export const logout = () => {
  console.warn("🚪 로그아웃 처리됨.");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
  window.location.href = "/login";
};
