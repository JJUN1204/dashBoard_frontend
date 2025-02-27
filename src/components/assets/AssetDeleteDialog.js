import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

/// 자산 삭제 모달 
function AssetDeleteDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      {/*자산 삭제 다이얼 로그그 */}
      <DialogTitle>자산 삭제</DialogTitle>
      <DialogContent>
        <DialogContentText>정말로 이 자산을 삭제하시겠습니까?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={onConfirm} color="error">삭제</Button> 
      </DialogActions>
    </Dialog>
  );
}

export default AssetDeleteDialog;
