import React from "react";
import {
    Modal,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


/// 자산 상세보기 모달
function AssetDetailModal({ open, onClose, asset }) {
    if (!asset) return null;

    return (
        <Modal open={open}
            onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 500,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                    자산 상세 정보
                </Typography>

                <IconButton
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
                {/*자산 정보 표시*/}
                <List>
                    <ListItem>
                        <ListItemText primary="자산명" secondary={asset.name || "N/A"} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="IP 주소" secondary={asset.ip || "N/A"} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="종류" secondary={asset.type || "N/A"} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="시리얼 번호" secondary={asset.serialNumber || "N/A"} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="메모" secondary={asset.memo || "N/A"} />
                    </ListItem>
                </List>

                {/* / 부품 정보 표시 */}
                <Typography variant="h6" sx={{ mt: 2 }}>
                    부품 목록
                </Typography>
                <List>
                    {asset.parts && asset.parts.length > 0 ? (
                        asset.parts.map((part) => (
                            <ListItem key={part.id}>
                                <ListItemText
                                    primary={part.name}
                                    secondary={`ID: ${part.id} | 제조사: ${part.manufacturer}`}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography color="textSecondary">연결된 부품이 없습니다.</Typography>
                    )}
                </List>

            </Box>
        </Modal>
    );
}

export default AssetDetailModal;