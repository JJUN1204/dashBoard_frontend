import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 0,
  rowsPerPage: 10,
  total: 0,
  keyword: "",
  searchType: "",
  sortColumn: "created_at",
  sortDirection: "desc",
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage: (state, action) => { state.page = action.payload; },
    setRowsPerPage: (state, action) => { state.rowsPerPage = action.payload; },
    setTotal: (state, action) => { state.total = action.payload; },
    setKeyword: (state, action) => { state.keyword = action.payload; },
    setSearchType: (state, action) => { state.searchType = action.payload; },
    setSortColumn: (state, action) => { state.sortColumn = action.payload; },
    setSortDirection: (state, action) => { state.sortDirection = action.payload; },

    //리덕스 상태 초기화
    resetPagination: () => initialState,
  },
});

export const { setPage, setRowsPerPage, setTotal, setKeyword, setSearchType, setSortColumn, setSortDirection, resetPagination } = paginationSlice.actions;
export default paginationSlice.reducer;
