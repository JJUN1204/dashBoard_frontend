import React, { useEffect, useState } from "react";
import { Container, Typography, Button, CircularProgress, TextField, MenuItem, TablePagination } from "@mui/material";
import { fetchParts, deletePart } from "../../api/partApi";
import PartTable from "../../components/parts/PartTable";
import PartFormModal from "../../components/parts/PartFormModal";
import Pagination from "../../components/common/Pagination";
import AlertMessage from "../../components/common/AlertMessage"; 
import { useDispatch, useSelector } from "react-redux";
import { setPage, setRowsPerPage, setTotal, setKeyword, setSearchType, setSortColumn, setSortDirection, resetPagination } from "../../redux/paginationSlice";


function PartListPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [keyword, setKeyword] = useState("");
  //const [searchType, setSearchType] = useState("name");
  //const [page, setPage] = useState(0);
  //const [rowsPerPage, setRowsPerPage] = useState(10);
  //const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const dispatch = useDispatch();

  const { page, rowsPerPage, total, keyword, searchType, sortColumn, sortDirection } = useSelector((state) => state.pagination); 

  useEffect(() => {
    loadParts();
    //dispatch(resetPagination());
  }, [page, rowsPerPage, sortColumn, sortDirection]);

  const loadParts = async () => {
    setLoading(true);
    try {
      const response = await fetchParts({ page: page + 1, recordSize: rowsPerPage, keyword, searchType, sortColumn, sortDirection });
      setParts(response.data);
      dispatch(setTotal(response.total));
    } catch (error) {
      console.error("부품 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try{
        let result;
        result = await deletePart(id);
        setAlertMessage(result.message);
        setAlertType(result.success ? "success" : "error");
        setAlertOpen(true);
        loadParts();
      }catch(e){
        setAlertMessage("삭제 실패! 다시 시도해주세요.");
        setAlertType("error");
        setAlertOpen(true);
      }
    }
  };

  const handleOpen = (part = null) => {
    setSelectedPart(part);
    setOpen(true);
  };

  const handleKeyDown = (e) => {
    console.log("awdawawdaw");
    if (e.key === 'Enter') {
      loadParts();  
    }
  };

   const handleSearchChange = (e) => {
      dispatch(setSearchType(e.target.value));
    };
  
    const handleSortChange = (column) => {
      const isAsc = sortColumn === column && sortDirection === "asc";
      dispatch(setSortColumn(column));
      dispatch(setSortDirection(isAsc ? "desc" : "asc"));
    };


  return (
   
    <>
    <Container>
      <Typography variant="h4" sx={{ my: 3 }}>부품 리스트</Typography>
      <div style={{ marginBottom: "16px" }}>
        <TextField label="검색어" value={keyword} onChange={(e) => dispatch(setKeyword(e.target.value))} onKeyDown={handleKeyDown}  style={{ marginRight: "8px" }} />
        <TextField label="검색 유형" select value={searchType} onChange={(e) => handleSearchChange(e)} style={{ marginRight: "8px", width: "150px" }}>
          <MenuItem value="name">부품명</MenuItem>
          <MenuItem value="serialNumber">시리얼 번호</MenuItem>
          <MenuItem value="manufacturer">제조사</MenuItem>
        </TextField>
        <Button variant="contained" onClick={loadParts} sx={{ marginRight: "8px" }}>검색</Button>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>부품 등록</Button>
      </div>
      {loading ? <CircularProgress /> : <PartTable parts={parts} onEdit={handleOpen} onDelete={handleDelete} onSort={handleSortChange} 
            sortColumn={sortColumn} 
            sortDirection={sortDirection}/>}
        <Pagination
            page={page}
            total={total}
            rowsPerPage={rowsPerPage}
            setPage={(newPage) => dispatch(setPage(newPage))} 
            setRowsPerPage={(newRowsPerPage) => dispatch(setRowsPerPage(newRowsPerPage))}
          />
      <PartFormModal open={open} onClose={() => setOpen(false)} part={selectedPart} refresh={loadParts} />
    </Container>

    <AlertMessage
    open={alertOpen}
    onClose={() => setAlertOpen(false)}
    message={alertMessage}
    severity={alertType}
  />
    </>
   
  );
}

export default PartListPage;
