import React, { useEffect, useState } from "react";
import { fetchUnassignedParts } from "../../api/partApi";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function PartSelector({ onSelect }) {
  const [parts, setParts] = useState([]);
  const [open, setOpen] = useState(false);

  // 부품 리스트 로드
  useEffect(() => {
    fetchUnassignedParts().then(setParts);
  }, []);

  const handleChange = (event) => {
    const selectedPartId = event.target.value; //  단일 값이므로 배열로 감싸기
    onSelect(selectedPartId);
    setOpen(false);
  };
  

  return (
    <FormControl fullWidth>
      <InputLabel>부품 선택</InputLabel>
      <Select
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={[]} //  항상 빈 배열로 설정 → UI에 선택된 값 표시 X
        onChange={handleChange}
        renderValue={() => "부품 선택"} //  항상 "부품 선택"이 표시됨
      >
        {parts.map((part) => (
          <MenuItem key={part.id} value={part.id}>
            {part.name} ({part.serialNumber})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default PartSelector;
