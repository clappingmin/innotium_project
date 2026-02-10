import { styled } from '@mui/material/styles';
import { Box, Accordion } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PII_ICONS = {
  residentRegistrationNumber: '🆔', // 주민등록번호
  foreignResidentRegistrationNumber: '🌏', // 외국인 주민등록번호
  passportNumber: '✈️', // 여권번호
  driverLicenseNumber: '🚗', // 운전번호
  phoneNumber: '☎️', // 전화번호
  mobilePhoneNumber: '📱', // 휴대전화번호
  bankAccountNumber: '💳', // 계좌번호
  creditCardNumber: '💳', // 신용카드 번호
  emailAddress: '📧', // 이메일
  businessRegistrationNumber: '🏢', // 사업자 등록번호
};

const PII_NAMES = {
  residentRegistrationNumber: '주민등록번호',
  foreignResidentRegistrationNumber: '외국인등록번호',
  passportNumber: '여권번호',
  driverLicenseNumber: '운전면허번호',
  phoneNumber: '전화번호',
  mobilePhoneNumber: '휴대전화번호',
  bankAccountNumber: '계좌번호',
  creditCardNumber: '신용카드번호',
  emailAddress: '이메일',
  businessRegistrationNumber: '사업자등록번호',
};

function PIIList({ items }) {
  return (
    <PIIContainer>
      {Object.entries(items).map(([type, data]) => (
        <PIIAccordion key={type} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PIIHeader>
              <PIIIcon>{PII_ICONS[type] || '📄'}</PIIIcon>
              <PIITitle>{PII_NAMES[type] || type}</PIITitle>
              <PIICount>{data.count}건</PIICount>
            </PIIHeader>
          </AccordionSummary>
          <AccordionDetails>
            <PIIItemList>
              {data.items.map((item, index) => (
                <PIIItem key={index}>• {item}</PIIItem>
              ))}
            </PIIItemList>
          </AccordionDetails>
        </PIIAccordion>
      ))}
    </PIIContainer>
  );
}

export const PIIContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const PIIAccordion = styled(Accordion)({
  border: '1px solid #e0e0e0',
  borderRadius: '8px !important',
  '&:before': {
    display: 'none',
  },
  boxShadow: 'none',
});

export const PIIHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
});

export const PIIIcon = styled('span')({
  fontSize: '24px',
});

export const PIITitle = styled('span')({
  fontSize: '16px',
  fontWeight: 500,
  flex: 1,
});

export const PIICount = styled('span')({
  fontSize: '14px',
  color: '#1976d2',
  fontWeight: 600,
  backgroundColor: '#e3f2fd',
  padding: '4px 12px',
  borderRadius: '12px',
});

export const PIIItemList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: '8px 0 0 0',
});

export const PIIItem = styled('li')({
  padding: '8px 12px',
  backgroundColor: '#f5f5f5',
  borderRadius: '6px',
  marginBottom: '8px',
  fontFamily: 'monospace',
  fontSize: '14px',
  color: '#424242',
  '&:last-child': {
    marginBottom: 0,
  },
});

export default PIIList;
