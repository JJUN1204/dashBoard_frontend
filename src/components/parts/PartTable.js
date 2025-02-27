import React, { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Button } from "@mui/material";

function PartTable({ parts = [], onEdit, onDelete, onSort, sortColumn, sortDirection }) {

  const [order, setOrder] = useState("desc"); // 정렬 방향 asc,desc
  const [orderBy, setOrderBy] = useState("row_num"); // 정렬 기준 컬럼

  // 정렬 함수
  const handleRequestSort = (property) => {
    onSort(property);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>No</TableCell>
          <TableCell>
            <TableSortLabel
              active={sortColumn === "id"}
              direction={sortColumn === "id" ? sortDirection : "desc"}
              onClick={() => handleRequestSort("id")}
            >
              ID
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortColumn === "name"}
              direction={sortColumn === "name" ? sortDirection : "desc"}
              onClick={() => handleRequestSort("name")}
            >
              부품명
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortColumn === "serialNumber"}
              direction={sortColumn === "serialNumber" ? sortDirection : "desc"}
              onClick={() => handleRequestSort("serialNumber")}
            >
              시리얼 번호
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortColumn === "manufacturer"}
              direction={sortColumn === "manufacturer" ? sortDirection : "desc"}
              onClick={() => handleRequestSort("manufacturer")}
            >
              제조사
            </TableSortLabel>
          </TableCell>
          <TableCell>작업</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.isArray(parts) && parts.length > 0 ? (
          parts.map((part) => (
            <TableRow key={part.id}>
              <TableCell>No.{part.row_num}</TableCell>
              <TableCell>{part.id}</TableCell>
              <TableCell>{part.name}</TableCell>
              <TableCell>{part.serialNumber}</TableCell>
              <TableCell>{part.manufacturer}</TableCell>
              <TableCell>
                <Button onClick={() => onEdit(part)}>수정</Button>
                <Button color="error" onClick={() => onDelete(part.id)}>삭제</Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} align="center">데이터가 없습니다.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default PartTable;
