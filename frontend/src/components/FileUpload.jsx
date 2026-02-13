import { styled } from "@mui/material/styles";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import colors from "../styles/colors";

function FileUpload({ onAnalyze, isAnalyzing }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [enablePdfOcr, setEnablePdfOcr] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);

    // 기존 URL 있으면 해제 (메모리 누수 방지)
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(selectedFile);

    setPreview(url);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleClick = () => {
    document.getElementById("file-input").click();
  };

  const handleAnalyze = () => {
    if (file) {
      onAnalyze(file, enablePdfOcr);
    }
  };

  return (
    <UploadContainer>
      <DropZone
        isDragging={isDragging}
        hasFile={!!file}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {!file ? (
          <>
            <UploadIcon>📁</UploadIcon>
            <UploadText>
              <strong>클릭</strong>하거나 파일을 <strong>드래그</strong>하여
              업로드
            </UploadText>
            <UploadText style={{ fontSize: "14px", color: "#9e9e9e" }}>
              PNG, JPG, PDF 파일 지원
            </UploadText>
            <UploadButton variant="outlined">파일 선택</UploadButton>
          </>
        ) : (
          <>
            {/* 이미지면 img */}
            {preview && file?.type?.startsWith("image/") && (
              <PreviewImage src={preview} alt="미리보기" />
            )}

            {/* PDF면 iframe */}
            {preview &&
              (file?.type === "application/pdf" ||
                file?.name?.toLowerCase().endsWith(".pdf")) && (
                <PdfPreview src={preview} title="PDF 미리보기" />
              )}
            <FileName>📄 {file.name}</FileName>
            <div>
              <UploadButton variant="outlined" style={{ marginRight: "8px" }}>
                파일 변경
              </UploadButton>
              <AnalyzeButton
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnalyze();
                }}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{ mr: 1 }}
                      color="inherit"
                    />
                    분석 중...
                  </>
                ) : (
                  "문서 분석 시작"
                )}
              </AnalyzeButton>
            </div>
            {file.type === "application/pdf" && (
              <StopClick
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={enablePdfOcr}
                      onChange={(e) => setEnablePdfOcr(e.target.checked)}
                    />
                  }
                  label="PDF 내 이미지 텍스트까지 포함하여 분석"
                  sx={{ minWidth: 180, color: colors.text }}
                />
              </StopClick>
            )}
          </>
        )}
      </DropZone>
    </UploadContainer>
  );
}

export const UploadContainer = styled(Box)({
  marginBottom: "32px",
});

export const DropZone = styled(Box)(({ isDragging, hasFile }) => ({
  border: isDragging ? "3px dashed #1976d2" : "2px dashed #d0d0d0",
  borderRadius: "12px",
  padding: "48px",
  textAlign: "center",
  backgroundColor: isDragging ? "#f0f7ff" : hasFile ? "#f5f5f5" : "#fafafa",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#f0f0f0",
    borderColor: "#1976d2",
  },
}));

export const UploadIcon = styled("div")({
  fontSize: "64px",
  marginBottom: "16px",
  color: "#757575",
});

export const UploadText = styled("p")({
  fontSize: "16px",
  color: "#616161",
  margin: "8px 0",
});

export const UploadButton = styled(Button)({
  marginTop: "16px",
  padding: "10px 32px",
  fontSize: "15px",
  textTransform: "none",
});

export const PreviewImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "300px",
  borderRadius: "8px",
  marginTop: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
});

export const PdfPreview = styled("iframe")({
  width: "100%",
  height: "300px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  marginTop: "16px",
});

export const FileName = styled("p")({
  fontSize: "14px",
  color: "#1976d2",
  fontWeight: 500,
  marginTop: "12px",
});

export const AnalyzeButton = styled(Button)({
  marginTop: "16px",
  padding: "12px 48px",
  fontSize: "16px",
  textTransform: "none",
  fontWeight: 600,
});

const StopClick = styled("div")({
  display: "inline-flex",
  alignItems: "center",
});

export default FileUpload;
