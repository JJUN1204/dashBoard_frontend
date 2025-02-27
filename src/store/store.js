import { configureStore } from "@reduxjs/toolkit";
import paginationReducer from "../redux/paginationSlice";

const store = configureStore({
  reducer: {
    pagination: paginationReducer, // paginationReducer를 Store에 추가하여, 페이지네이션 데이터를 관리할 수 있도록 설정
  },
});

export default store;
