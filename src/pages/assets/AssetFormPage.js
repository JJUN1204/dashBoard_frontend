import React, { useEffect, useState } from "react";
import {
  Container, Typography, TextField, Button, Box, List, ListItem,
  ListItemText, IconButton, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { createAsset, updateAsset, getAssetById, fetchAssetTypes } from "../../api/assetApi";
import { fetchUnassignedParts } from "../../api/partApi";
import { useNavigate, useParams } from "react-router-dom";
import PartSelector from "../../components/common/PartSelector";
import AlertMessages from "../../components/common/AlertMessages";

function AssetFormPage() {
  const [asset, setAsset] = useState({
    name: "",
    ip: "",
    type: "",
    serialNumber: "",
    memo: "",
  });

  const [existingParts, setExistingParts] = useState([]); // / 기존 부품 리스트
  const [newParts, setNewParts] = useState([]); // / 새로 추가한 부품 리스트
  const [availableParts, setAvailableParts] = useState([]); // / 추가 가능한 부품 목록
  const [assetTypes, setAssetTypes] = useState([]); // / 자산 종류 리스트
  const navigate = useNavigate();
  const { id } = useParams();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const [messages, setMessages] = useState([]);


  useEffect(() => {
    loadAssetsWithParts();
  }, []);

  const loadAssetsWithParts = async () => {
    if (id) {
      const data = await getAssetById(id);
      console.log(data);

      setAsset({
        name: data.name,
        ip: data.ip,
        type: data.type,
        serialNumber: data.serialNumber,
        memo: data.memo,
      });

      setExistingParts(data.parts); //  기존 부품을 따로 저장
    }

    fetchUnassignedParts().then(setAvailableParts); //  등록되지 않은 부품 리스트 가져오기
    //console.log(availableParts);
    fetchAssetTypes().then(setAssetTypes); // 자산 종류 데이터 가져오기
  };

  const addMessage = (message, severity = "info") => {
    setMessages((prev) => [...prev, { id: Date.now(), message, severity }]);
  };


  //  부품 추가 선택 시 해당 부품을 newParts 리스트에 추가
  const handleAddPart = (selectedPartId) => {
    // 항상 배열로 변환하여 처리 (단일 값도 배열로 감싸기)
    const selectedParts = availableParts.filter((part) =>
      [selectedPartId].includes(part.id) // 🔹 단일 값이라도 배열로 처리
    );
  
    setNewParts([...newParts, ...selectedParts]);
  };
  


  //기존 부품배열에서만 삭제
  const handleRemoveExistingPart = (mappingId) => {
    setExistingParts((prevParts) => prevParts.filter((part) => part.mappingId !== mappingId));
  };

  //새로 추가한 부품에서만 삭제
  // const handleRemoveNewPart = (serialNumber) => {
  //   console.log(serialNumber);
  //   setNewParts((prevParts) => prevParts.filter((part) => part.serialNumber !== serialNumber));
  // };
  const handleRemoveNewPart = (index) => {
    setNewParts((prevParts) => prevParts.filter((_, i) => i !== index));
  };


  const handleSubmit = async () => {
    try {
      if (!validation()) return;
      // 기존 부품 + 새로운 부품 ID 리스트
      const partIds = [...newParts.map((part) => part.id)];

      // 기존 부품들의 매핑 ID 리스트
      const mappingIds = existingParts.map((part) => part.mappingId);

      let result;
      if (id) {
        result = await updateAsset({ ...asset, id, partIds, mappingIds });
      } else {
        result = await createAsset({ ...asset, partIds });
      }

      addMessage(result.message, result.success ? "success" : "error");


      if (result.success) {
        setTimeout(() => {
          navigate("/assets");
        }, 1200);
      }
    } catch (error) {
      addMessage("실패! 다시 시도해주세요.", "error");
    }
  };



  const validation = () => {
    const trimmedName = asset.name.trim();
    const trimmedIp = asset.ip.trim();
    const trimmedSerialNumber = asset.serialNumber.trim();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      addMessage("자산명은 2글자 이상 50글자 이하로 입력해주세요.");
      return false;
    }
    if (trimmedIp.length < 5 || trimmedIp.length > 20) {
      addMessage("IP는 5글자 이상 20글자 이하로 입력해주세요.");
      return false;
    }
    if (asset.type.replaceAll(" ", "").length === 0) {
      addMessage("종류를 선택 해주세요.");
      return false;
    }
    if (trimmedSerialNumber.length < 5 || trimmedSerialNumber.length > 20) {
      addMessage("시리얼 번호는 5글자 이상 20글자 이하로 입력해주세요.");
      return false;
    }
    return true;
  };


  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, p: 3, bgcolor: "#f9f9f9", borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
          {id ? "자산 수정" : "자산 등록"}
        </Typography>

        {/* 자산 입력 필드 */}
        <TextField fullWidth variant="outlined" label="자산명" value={asset.name} onChange={(e) => setAsset({ ...asset, name: e.target.value })} sx={{ my: 1 }} />
        <TextField fullWidth variant="outlined" label="IP" value={asset.ip} onChange={(e) => setAsset({ ...asset, ip: e.target.value })} sx={{ my: 1 }} />

        {/* 종류 선택 (Select) */}
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>자산 종류</InputLabel>
          <Select value={asset.type} onChange={(e) => setAsset({ ...asset, type: e.target.value })}>
            {assetTypes.map((type) => (
              <MenuItem key={type.typeCode} value={type.typeCode}>
                {type.typeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField fullWidth variant="outlined" label="시리얼 번호" value={asset.serialNumber} onChange={(e) => setAsset({ ...asset, serialNumber: e.target.value })} sx={{ my: 1 }} />
        <TextField fullWidth variant="outlined" multiline rows={3} label="메모" value={asset.memo} onChange={(e) => setAsset({ ...asset, memo: e.target.value })} sx={{ my: 1 }} />

        {/* 부품 선택 (PartSelector) */}
        <PartSelector selectedParts={newParts.map((part) => part.id)} onSelect={handleAddPart} />

        {/* 기존 부품 목록 */}
        {id && existingParts.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">기존 부품</Typography>
            <List>
              {existingParts.map((part) => (
                <ListItem key={part.id} secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemoveExistingPart(part.mappingId)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <ListItemText primary={part.name} secondary={`ID: ${part.id} / 제조사: ${part.manufacturer}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* / 새로 추가된 부품 목록 */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">추가될 부품</Typography>
          <List>
            {newParts.map((part, index) => (
              <ListItem key={`${part.id}-${index}`} secondaryAction={
                <IconButton edge="end" onClick={() => handleRemoveNewPart(index)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText primary={part.name} secondary={`ID: ${part.id} / 제조사: ${part.manufacturer}`} />
              </ListItem>
            ))}
          </List>

        </Box>

        {/* / 등록 / 수정 버튼 */}
        <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ mt: 3 }}>
          {id ? "수정" : "등록"}
        </Button>
      </Container>

      <AlertMessages messages={messages} setMessages={setMessages} />
    </>
  );
}

export default AssetFormPage;
