import React from "react";
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText, Button, Divider } from "@mui/material";
import { useDispatch } from "react-redux";
import { resetPagination } from "../../redux/paginationSlice";


const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogout = () => {
    localStorage.removeItem("token"); // / 저장된 JWT 토큰 삭제
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("username")
    alert("로그아웃 되었습니다.");
    navigate("/"); // / 로그인 페이지로 이동
  };

  const handleAssetMove = () =>{
    dispatch(resetPagination());
    navigate("/assets");
  }

  const handleParttMove = () =>{
    dispatch(resetPagination());
    navigate("/parts");
  }

  return (
    <div style={{ width: "250px", padding: "16px", background: "#f5f5f5", height: "100vh" }}>
      <h3>메뉴</h3>
      <List>
        <ListItem button onClick={handleAssetMove}>
          <ListItemText primary="자산 관리" />
        </ListItem>
        <ListItem button onClick={handleParttMove}>
          <ListItemText primary="부품 관리" />
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      <Button variant="contained" color="error" fullWidth onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  );
};

export default Sidebar;
