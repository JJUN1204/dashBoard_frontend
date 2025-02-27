import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box, Alert,IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        const response = await axios.post("http://localhost:8081/api/login", {
            username: username,
            password: password,
        });

        console.log("로그인 응답:", response.data);  //  응답 데이터 확인

        //  토큰이 undefined인지 확인
        if (!response.data.accessToken || !response.data.refreshToken) {
            console.error("❌ 토큰이 없습니다! 응답 데이터:", response.data);
            return;
        }

        //  정상적으로 토큰 저장
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("username", response.data.username);

        alert("로그인 성공!");
        navigate("/assets");
    } catch (error) {
        console.error("로그인 실패:", error.response?.data || error.message);
        setError("로그인 실패! ID 또는 비밀번호를 확인해 주세요.");
    }
};


  //비밀번호 보이게 하고 안보이게 하는 함수
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    console.log("awdawawdaw");
    if (e.key === 'Enter') {
      handleLogin(); 

    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>

        {/* 로그인 제목 */}
        <Typography variant="h4" gutterBottom align="center">
          로그인
        </Typography>

        {/* 에러 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}> .
            {error}
          </Alert>
        )}

        {/* 로그인 폼 */}
        <TextField
          fullWidth
          label="ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ?  <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* 로그인 버튼 */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          로그인
        </Button>

        {/* 회원가입 이동 버튼 */}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          계정이 없으신가요?{" "}
          <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
            회원가입
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginPage;
