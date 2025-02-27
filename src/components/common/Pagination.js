import React from "react";
import { TablePagination, Pagination, Box } from "@mui/material";

function Paginations({ page, total, rowsPerPage, setPage, setRowsPerPage }) {
  // 전체 페이지 수 계산
  const pageCount = Math.ceil(total / rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); 
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between" 
      width="100%" 
      sx={{ mt: 2, px: 2 }} 
    >
      
      <Pagination
        count={pageCount}
        page={page + 1} // Pagination은 1부터 시작
        onChange={handlePageChange}
        showFirstButton // << (처음 페이지)
        showLastButton  // >> (마지막 페이지)
        siblingCount={1} // 현재 페이지 주변 표시할 페이지 개수
        boundaryCount={1} // 처음과 끝에서 보여줄 페이지 개수
        size="medium" // 크기 설정
      />

      
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 20, 50]} // 선택 가능한 페이지당 항목 수
      />
    </Box>
  );
}

export default Paginations;
