import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPagination } from "../../redux/paginationSlice";

function PageChangeListener() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // 특정 페이지 이동 시 리덕스 초기화
    if (location.pathname === "/assets" || location.pathname === "/parts") {
      dispatch(resetPagination());
    }
  }, [location.pathname, dispatch]);

  return null; // UI를 렌더링할 필요 없음
}

export default PageChangeListener;
