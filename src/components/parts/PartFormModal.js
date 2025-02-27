import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { createPart, updatePart } from "../../api/partApi";
import AlertMessages from "../common/AlertMessages";

function PartFormModal({ open, onClose, part, refresh }) {
  const [formData, setFormData] = useState({ name: "", serialNumber: "", manufacturer: "" });
  const [messages, setMessages] = useState([]); //  여러 개의 메시지를 저장하는 배열

  useEffect(() => {
    if (part) {
      setFormData(part);
    } else {
      setFormData({ name: "", serialNumber: "", manufacturer: "" });
    }
  }, [part, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addMessage = (message, severity = "info") => {
    setMessages((prev) => [...prev, { id: Date.now(), message, severity }]); //  새로운 메시지를 배열에 추가
  };

  const handleSubmit = async () => {
    try {
      if (!validation()) return;

      let result;
      if (part) {
        result = await updatePart(formData);
      } else {
        result = await createPart(formData);
      }

      addMessage(result.message, result.success ? "success" : "error"); //  성공 메시지 추가

      if (result.success) {
        refresh();
        onClose();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "처리 중 오류가 발생했습니다.";
      addMessage(errorMessage, "error"); // 실패 메시지 추가
    }
  };

  const validation = () => {
    const trimmedName = formData.name.trim();
    const trimmedSerialNumber = formData.serialNumber.trim();
    const trimmedManufacturer = formData.manufacturer.trim();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      addMessage("부품명은 2글자 이상 50글자 이하로 입력해주세요.");
      return false;
    }
    if (trimmedSerialNumber.length < 5 || trimmedSerialNumber.length > 20) {
      addMessage("시리얼 번호는 5글자 이상 20글자 이하로 입력해주세요.");
      return false;
    }
    if (trimmedManufacturer.length < 2 || trimmedManufacturer.length > 50) {
      addMessage("제조사는 2글자 이상 50글자 이하로 입력해주세요.");
      return false;
    }
    return true;
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">{part ? "부품 수정" : "부품 등록"}</Typography>
          <TextField fullWidth label="부품명" name="name" value={formData.name} onChange={handleChange} sx={{ my: 1 }} />
          <TextField fullWidth label="시리얼 번호" name="serialNumber" value={formData.serialNumber} onChange={handleChange} sx={{ my: 1 }} />
          <TextField fullWidth label="제조사" name="manufacturer" value={formData.manufacturer} onChange={handleChange} sx={{ my: 1 }} />
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
            저장
          </Button>
        </Box>
      </Modal>

      {/*  여러 개의 메시지를 관리하는 `AlertMessage` */}
      <AlertMessages messages={messages} setMessages={setMessages} />
    </>
  );
}

export default PartFormModal;
