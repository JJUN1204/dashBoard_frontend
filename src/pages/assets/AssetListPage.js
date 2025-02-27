import React, { useEffect, useState } from "react";
import { Container, Typography, Button, CircularProgress, TextField, MenuItem, Select } from "@mui/material";
import { fetchAssets, deleteAsset, fetchAssetTypes } from "../../api/assetApi";
import AssetTable from "../../components/assets/AssetTable";
import AssetDeleteDialog from "../../components/assets/AssetDeleteDialog";
import TablePagination from "../../components/common/Pagination";
import AlertMessage from "../../components/common/AlertMessage";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setPage, setRowsPerPage, setTotal, setKeyword, setSearchType, setSortColumn, setSortDirection, resetPagination } from "../../redux/paginationSlice";

function AssetListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux 에서 상태 가져오기
  const { page, rowsPerPage, total, keyword, searchType, sortColumn, sortDirection } = useSelector((state) => state.pagination);

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetTypes, setAssetTypes] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [messages, setMessages] = useState([]);
  

  useEffect(() => {
    loadAssets();
    fetchAssetTypes().then(setAssetTypes);
    //dispatch(resetPagination());
  }, [page, rowsPerPage, sortColumn, sortDirection]); // / 페이지나 rowsPerPage가 변경될 때 데이터 새로 로드

  if (searchType === "type") {
  }

  const addMessage = (message, severity = "info") => {
    setMessages((prev) => [...prev, { id: Date.now(), message, severity }]);
  };
  
  const loadAssets = async () => {
    setLoading(true);
    try {
      const response = await fetchAssets({ page: page + 1, recordSize: rowsPerPage, keyword, searchType, sortColumn, sortDirection, totalCount : total });
      setAssets(response.data);
      dispatch(setTotal(response.total)); // / Redux에 total 저장
    } catch (error) {
      console.error("자산 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // / 삭제 다이얼로그 열기
  const handleDeleteOpen = (id) => {
    setSelectedAsset(id);
    setDeleteOpen(true);
  };

  // / 삭제 실행
  const handleDeleteConfirm = async () => {
    try {
      let result;
      if (selectedAsset) {
        result = await deleteAsset(selectedAsset);
      }

      

      setAlertMessage(result.message);
      setAlertType(result.success ? "success" : "error");
      setAlertOpen(true);
      setTimeout(() => {
        setDeleteOpen(false);
        loadAssets();
      }, 999);
    } catch (e) {
      setAlertMessage("삭제 실패! 다시 시도해주세요.");
      setAlertType("error");
      setAlertOpen(true);
    }
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchType(e.target.value));
    if (searchType === "type") {
      dispatch(setKeyword(""));
    }
  };

  //엔터로 검색하기기
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      loadAssets();
      dispatch(setPage(0));
    }
  };

  const handleSortChange = (column) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    dispatch(setSortColumn(column));
    dispatch(setSortDirection(isAsc ? "desc" : "asc"));
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 3 }}>
        자산 리스트
      </Typography>

      <div style={{ marginBottom: "16px" }}>
        {searchType !== "type" ? (
          <TextField label="검색어" value={keyword} onChange={(e) => dispatch(setKeyword(e.target.value))} onKeyDown={handleKeyDown} style={{ marginRight: "8px" }} />
        ) : (
          <TextField
            label="장비명"
            select
            value={keyword}
            onChange={(e) => dispatch(setKeyword(e.target.value))}
            onKeyDown={handleKeyDown}
            style={{ marginRight: "8px", width: "150px" }}
          >
            {assetTypes.map((type) => (
              <MenuItem key={type.typeCode} value={type.typeCode}>
                {type.typeName}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField label="검색 유형" select value={searchType} onChange={(e) => handleSearchChange(e)} style={{ marginRight: "8px", width: "150px" }}>
          <MenuItem value="name">자산명</MenuItem>
          <MenuItem value="serialNumber">시리얼 번호</MenuItem>
          <MenuItem value="type">장비 종류</MenuItem>
        </TextField>
        <Button variant="contained" onClick={loadAssets} sx={{ marginRight: "8px" }}>
          검색
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate("/assets/register")}>
          자산 등록
        </Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <AssetTable 
            assets={assets} 
            onEdit={(asset) => navigate(`/assets/edit/${asset.id}`)} 
            onDelete={handleDeleteOpen}  
            onSort={handleSortChange} 
            sortColumn={sortColumn} 
            sortDirection={sortDirection}
          />

          

          <TablePagination
            page={page}
            total={total}
            rowsPerPage={rowsPerPage}
            setPage={(newPage) => dispatch(setPage(newPage))} 
            setRowsPerPage={(newRowsPerPage) => dispatch(setRowsPerPage(newRowsPerPage))}
          />
        </>
      )}
      <AssetDeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDeleteConfirm} />

      <AlertMessage open={alertOpen} onClose={() => setAlertOpen(false)} message={alertMessage} severity={alertType} />
    </Container>
  );
}

export default AssetListPage;
