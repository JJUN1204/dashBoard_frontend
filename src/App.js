import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AssetListPage from "./pages/assets/AssetListPage";
import AssetFormPage from "./pages/assets/AssetFormPage";
import PartListPage from "./pages/parts/PartListPage";
import Sidebar from "./components/common/Sidebar";
import PageChangeListener from "./components/common/PageChangeListener";

function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "16px" }}>{children}</div>
    </div>
  );
}


function App() {
  return (
    <Router>
      {/* <PageChangeListener /> */}
      <Routes>
        {/* 로그인 & 회원가입 */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 자산 관련 페이지 */}
        <Route path="/assets" element={<Layout><AssetListPage /></Layout>}/>
        <Route path="/assets/register" element={<Layout><AssetFormPage /></Layout>}/>
        <Route path="/assets/edit/:id" element={<Layout><AssetFormPage /></Layout>}/>

        {/* 부품 관련 페이지 */}
        <Route path="/parts" element={<Layout><PartListPage /></Layout>}/>
      </Routes>
    </Router>
  );
}

export default App;
