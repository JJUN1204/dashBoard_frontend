import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

function AlertMessage({ open, onClose, message, severity = "success", duration = 3000 }) {
  const [snackbarKey, setSnackbarKey] = useState(0);

  useEffect(() => {
    if (open) {
      setSnackbarKey((prev) => prev + 1); //key를 변경해서 새롭게 렌더링
    }
  }, [open]);

  return (
    <Snackbar
      key={snackbarKey}
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} onClose={onClose} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertMessage;