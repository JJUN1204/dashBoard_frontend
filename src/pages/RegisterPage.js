import React, { useState, useRef } from "react";
import { TextField, Button, Container, Typography, Box, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:8081/api/register", {
        username: username,
        password: password,
      });
      setSuccess("회원가입 성공! 로그인 해주세요.");
      setError(""); 
    } catch (err) {
      setError(err.response?.data || "회원가입 실패! 다시 시도해 주세요.");
      setSuccess("");
    }
  };

  //비밀번호 보이게 관리하는 함수수
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    console.log("awdawawdaw");
    if (e.key === 'Enter') {
      handleRegister(); 
    }
  };

  const handleBackButton = () => {
    console.log("확인용");
    navigate("/");
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          회원가입
        </Typography>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                  {showConfirmPassword ?  <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegister}
        >
          회원가입
        </Button>
                              
        <Button
          onClick={handleBackButton}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          style={{ backgroundColor: "orange" }}
        >
          {/* <Link to="/" style={{ textDecoration: "none", color: "white" }}> */}
            로그인 하러가기
          {/* </Link> */}
        </Button>
      </Box>
    </Container>
  );
}

export default RegisterPage;
