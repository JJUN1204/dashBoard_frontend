import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableSortLabel,
} from "@mui/material";
import AssetDetailModal from "./AssetDetailModal";
import { getAssetById } from "../../api/assetApi";

function AssetTable({ assets, onEdit, onDelete, onSort, sortColumn, sortDirection }) {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = async (assetId) => {
    try {
      const data = await getAssetById(assetId);
      setSelectedAsset(data);
      setModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequestSort = (property) => {
    //if (property !== "row_num") {
      // row_num은 정렬 비활성화
      onSort(property);
   // }
  };
  
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {/* row_num 정렬 버튼 제거 (고정된 역순) */}
            <TableCell>No</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortColumn === "id"}
                direction={sortColumn === "id" ? sortDirection : "desc" }
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
                자산명
              </TableSortLabel>
            </TableCell>  
            <TableCell>
              <TableSortLabel
                active={sortColumn === "ip"}
                direction={sortColumn === "ip" ? sortDirection : "desc"}
                onClick={() => handleRequestSort("ip")}
              >
                IP
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortColumn === "typeName"}
                direction={sortColumn === "typeName" ? sortDirection : "desc"}
                onClick={() => handleRequestSort("typeName")}
              >
                종류
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
            <TableCell>메모</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortColumn === "partCount"}
                direction={sortColumn === "partCount" ? sortDirection : "desc"}
                onClick={() => handleRequestSort("partCount")}
              >
                부품수
              </TableSortLabel>
            </TableCell>
            <TableCell>작업</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.length > 0 ? (
            assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>No.{asset.row_num}</TableCell>
                <TableCell>{asset.id}</TableCell>
                <TableCell
                  style={{ cursor: "cursur", color: "blue", textDecoration: "none" }}
                  onClick={() => handleOpenModal(asset.id)}
                >
                  {asset.name}
                </TableCell>
                <TableCell>{asset.ip}</TableCell>
                <TableCell>{asset.typeName}</TableCell>
                <TableCell>{asset.serialNumber}</TableCell>
                <TableCell>{asset.memo}</TableCell>
                <TableCell>{asset.partCount}</TableCell>
                <TableCell>
                  <Button onClick={() => onEdit(asset)}>수정</Button>
                  <Button color="error" onClick={() => onDelete(asset.id)}>삭제</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">데이터가 없습니다.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AssetDetailModal open={modalOpen} onClose={() => setModalOpen(false)} asset={selectedAsset} />
    </>
  );
}

export default AssetTable;
