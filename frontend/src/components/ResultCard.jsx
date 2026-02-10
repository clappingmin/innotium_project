import { styled } from '@mui/material/styles';
import { Box, Card, Chip, LinearProgress } from '@mui/material';
import PIIList from './PIIList';

function ResultCard({ result }) {
  if (!result) {
    return (
      <ResultContainer>
        <EmptyMessage>문서를 업로드하고 분석을 시작하세요</EmptyMessage>
      </ResultContainer>
    );
  }

  const { classification, risk_score, detected_items, total_count } = result.detection;

  return (
    <ResultContainer>
      <StatusSection>
        <ClassificationBadge level={classification} label={`${classification} 문서`} size="large" />
        <RiskScoreContainer>
          <RiskScoreLabel>
            <span>위험도</span>
            <strong>{risk_score}점</strong>
          </RiskScoreLabel>
          <RiskScoreBar variant="determinate" value={risk_score} />
        </RiskScoreContainer>
      </StatusSection>

      <PIISection>
        <SectionTitle>검출된 민감정보 {total_count > 0 && `(${total_count}건)`}</SectionTitle>
        {total_count === 0 ? (
          <EmptyMessage>민감정보가 검출되지 않았습니다 ✅</EmptyMessage>
        ) : (
          <PIIList items={detected_items} />
        )}
      </PIISection>
    </ResultContainer>
  );
}

export const ResultContainer = styled(Card)({
  padding: '32px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  marginBottom: '24px',
});

export const StatusSection = styled(Box)({
  marginBottom: '24px',
  paddingBottom: '24px',
  borderBottom: '1px solid #e0e0e0',
});

export const ClassificationBadge = styled(Chip)(({ level }) => {
  const colors = {
    일반: { bg: '#e8f5e9', color: '#2e7d32' },
    주의: { bg: '#fff3e0', color: '#e65100' },
    민감: { bg: '#ffebee', color: '#c62828' },
  };
  return {
    backgroundColor: colors[level]?.bg || '#f5f5f5',
    color: colors[level]?.color || '#000',
    fontSize: '16px',
    fontWeight: 600,
    padding: '24px 16px',
    height: 'auto',
  };
});

export const RiskScoreContainer = styled(Box)({
  marginTop: '16px',
});

export const RiskScoreLabel = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
  fontSize: '14px',
  color: '#616161',
});

export const RiskScoreBar = styled(LinearProgress)(({ value }) => ({
  height: '10px',
  borderRadius: '5px',
  backgroundColor: '#e0e0e0',
  '& .MuiLinearProgress-bar': {
    backgroundColor: value > 60 ? '#f44336' : value > 30 ? '#ff9800' : '#4caf50',
  },
}));

export const PIISection = styled(Box)({
  marginTop: '24px',
});

export const SectionTitle = styled('h3')({
  fontSize: '18px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '16px',
});

export const EmptyMessage = styled('p')({
  color: '#9e9e9e',
  fontSize: '15px',
  textAlign: 'center',
  padding: '32px',
});

export default ResultCard;
