import { useState, useEffect } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import colors from '../styles/colors';

function SettingsModal({ open, onClose }) {
  // 개인정보 설정
  const [settings, setSettings] = useState({
    residentRegistrationNumber: { enabled: false, count: 0, exceptions: '', label: '주민등록번호' },
    foreignResidentRegistrationNumber: {
      enabled: false,
      count: 0,
      exceptions: '',
      label: '외국인 주민등록번호',
    },
    passportNumber: { enabled: false, count: 0, exceptions: '', label: '여권번호' },
    driverLicenseNumber: { enabled: false, count: 0, exceptions: '', label: '운전면허번호' },
    emailAddress: { enabled: false, count: 0, exceptions: '', label: '이메일' },
    phoneNumber: { enabled: false, count: 0, exceptions: '', label: '전화번호' },
    mobilePhoneNumber: { enabled: false, count: 0, exceptions: '', label: '휴대전화번호' },
    businessRegistrationNumber: {
      enabled: false,
      count: 0,
      exceptions: '',
      label: '사업자등록번호',
    },
    corporateRegistrationNumber: {
      enabled: false,
      count: 0,
      exceptions: '',
      label: '법인등록번호',
    },
    creditCardNumber: { enabled: false, count: 0, exceptions: '', label: '신용카드번호' },
    bankAccountNumber: {
      enabled: true,
      count: 0,
      exceptions: '',
      label: '계좌번호',
    },
  });

  // localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('pii_settings');
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

  // 예외정보 추가
  const handleAddException = (key) => {
    const newException = {
      value: '',
      id: Date.now(),
    };
    setSettings({
      ...settings,
      [key]: {
        ...settings[key],
        exceptions: [...settings[key].exceptions, newException],
      },
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

  // 저장
  const handleSave = () => {
    localStorage.setItem('pii_settings', JSON.stringify(settings));
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle backgroundColor={colors.primary}>
        <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" color={colors.white}>
              개인정보 검출설정
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Typography variant="subtitle2" color={colors.primary} mb={2}>
          개인정보
        </Typography>

        {Object.entries(settings).map(([key, value]) => (
          <SettingRow key={key}>
            <FormControlLabel
              control={<Checkbox checked={value.enabled} onChange={() => handleToggle(key)} />}
              label={value.label}
              sx={{ minWidth: 180, color: colors.text }}
            />

            <CountField
              size="small"
              value={value.count}
              placeholder="검출개수"
              onChange={(e) => handleCountChange(key, e.target.value)}
              disabled={!value.enabled}
              type="number"
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
        ))}

        <Box mt={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>
            키워드 : 1건
          </Typography>
          <AddButton
            startIcon={<AddIcon />}
            size="small"
            onClick={() => handleAddException('계좌번호')}
          >
            추가
          </AddButton>
        </Box>

        <Box mt={3} sx={{ border: '1px solid rgba(0,0,0,0.15)', padding: '10px' }}></Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          닫기
        </Button>
        <Button onClick={handleSave} variant="contained">
          저장
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}

// Styled Components
const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: 8,
  },
});

const SettingRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginBottom: 12,
  '& .MuiFormControlLabel-root': {
    margin: 0,
  },
});

const CountField = styled(TextField)({
  width: 100,
});

const AddButton = styled(Button)({
  marginLeft: 16,
  textTransform: 'none',
});

export default SettingsModal;
