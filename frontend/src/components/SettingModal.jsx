import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  TextField,
  FormControlLabel,
  Box,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { styled } from "@mui/material/styles";
import colors from "../styles/colors";
import {
  DEFAULT_DETECTION_SETTINGS,
  DETECTION_ITEMS,
  EMPTY_KEYWORD,
} from "../constants/keywordRules";

function SettingsModal({ open, onClose }) {
  // 개인정보 설정
  const [settings, setSettings] = useState(DEFAULT_DETECTION_SETTINGS);

  // localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("pii_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // 체크박스 토글
  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: { ...settings[key], enabled: !settings[key].enabled },
    });
  };

  // 개수 변경
  const handleCountChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: { ...settings[key], count: value },
    });
  };

  // 예외정보 수정
  const handleExceptionChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: {
        ...settings[key],
        exceptions: value,
      },
    });
  };

  // 예외 키워드 추가
  const handleAddKeyword = () => {
    setSettings({
      ...settings,
      keyword: [...settings.keyword, EMPTY_KEYWORD],
    });
  };

  // 예외 키워드 수정 (텍스트)
  const handleKeywordChange = (index, value) => {
    const i = Number(index);

    setSettings((prev) => ({
      ...prev,
      keyword: prev.keyword.map((item, idx) =>
        idx === i ? { ...item, value } : item,
      ),
    }));
  };

  // 예외 키워드 수정 (텍스트)
  const handleKeywordCountChange = (index, value) => {
    const i = Number(index);

    setSettings((prev) => ({
      ...prev,
      keyword: prev.keyword.map((item, idx) =>
        idx === i ? { ...item, count: value } : item,
      ),
    }));
  };

  // 저장
  const handleSave = () => {
    localStorage.setItem("pii_settings", JSON.stringify(settings));
    onClose();
  };

  // 키워드 삭제
  const removeKeyword = (index) => {
    const i = Number(index); // 문자열 -> 숫자 변환
    setSettings({
      ...settings,
      keyword: settings.keyword.filter((_, idx) => idx !== i),
    });
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle backgroundColor={colors.primary}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={1}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="h6"
              color={colors.white}
              sx={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <EditSquareIcon />
              개인정보 검출설정
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Typography variant="subtitle2" color={colors.primary} mb={2}>
          개인정보
        </Typography>

        {Object.entries(settings).map(
          ([key, value]) =>
            DETECTION_ITEMS[key] &&
            key !== "keyword" && (
              <SettingRow key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value.enabled}
                      onChange={() => handleToggle(key)}
                    />
                  }
                  label={DETECTION_ITEMS[key]}
                  sx={{ minWidth: 180, color: colors.text }}
                />
                <CountField
                  size="small"
                  value={value.count}
                  placeholder="검출개수"
                  onChange={(e) => handleCountChange(key, e.target.value)}
                  disabled={!value.enabled}
                />
                <Box flex={1}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="예외정보식"
                    value={value.exceptions}
                    onChange={(e) => handleExceptionChange(key, e.target.value)}
                    disabled={!value.enabled}
                  />
                </Box>
              </SettingRow>
            ),
        )}

        <Box
          mt={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            키워드 : {settings.keyword.length}건
          </Typography>
          <IconButton
            size="small"
            variant="outlined"
            onClick={handleAddKeyword}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <Box
          mt={3}
          sx={{
            border: "1px solid rgba(0,0,0,0.15)",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {Object.entries(settings.keyword).map(([index, value]) => (
            <Box
              sx={{ display: "flex", gap: "10px", alignItems: "center" }}
              key={index}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="검출 키워드"
                value={value.value}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
              />
              <CountField
                size="small"
                value={value.count}
                placeholder="검출개수"
                onChange={(e) =>
                  handleKeywordCountChange(index, e.target.value)
                }
                type="number"
              />
              <IconButton
                size="small"
                sx={{ border: "rgba(0,0,0,0.15)" }}
                onClick={() => removeKeyword(index)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleSave} variant="contained">
          저장
        </Button>
        <Button onClick={onClose} variant="outlined">
          닫기
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}

// Styled Components
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    borderRadius: 8,
  },
});

const SettingRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginBottom: 12,
  "& .MuiFormControlLabel-root": {
    margin: 0,
  },
});

const CountField = styled(TextField)({
  width: 100,
});

const AddButton = styled(Button)({
  marginLeft: 16,
  textTransform: "none",
});

export default SettingsModal;
