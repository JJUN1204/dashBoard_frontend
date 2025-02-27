import React, { useEffect } from "react";
import { Alert, Box } from "@mui/material";

function AlertMessages({ messages = [], setMessages }) {
  useEffect(() => {
    // 각 메시지를 개별적으로 제거
    const timers = messages.map((msg, index) =>
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      }, 3000 + index * 500) //  0.5초 간격으로 하나씩 제거
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, [messages, setMessages]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 20, // y상단 중앙 정렬
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      {messages.length > 0 &&
        messages.map(({ id, message, severity }) => (
          <Alert
            key={id}
            severity={severity}
            variant="filled"
            onClose={() => setMessages((prev) => prev.filter((m) => m.id !== id))}
            sx={{ width: "300px", boxShadow: 3 }}
          >
            {message}
          </Alert>
        ))}
    </Box>
  );
}

export default AlertMessages;
