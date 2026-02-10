import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';

function Header({ onSettingsClick }) {
  return (
    <>
      <HeaderContainer>
        <Title>
          <DescriptionIcon sx={{ fontSize: 36, color: '#1976d2' }} />
          AI 문서 민감정보 검출 시스템
        </Title>
        <SettingsButton onClick={onSettingsClick}>
          <SettingsIcon />
        </SettingsButton>
      </HeaderContainer>
    </>
  );
}

export const HeaderContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '24px 32px',
  marginBottom: '32px',
  borderBottom: '1px solid #e0e0e0',
});

export const Title = styled('h1')({
  fontSize: '28px',
  fontWeight: 700,
  color: '#1a1a1a',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const SettingsButton = styled(IconButton)({
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});
export default Header;
