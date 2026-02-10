import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import colors from '../styles/colors';
import { DETECTION_ITEMS } from '../constants/keywordRules';

function SettingModal({ open, onClose }) {
  // props 받기
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalBox>
        <Header>
          <HeaderText>개인정보 검출설정</HeaderText>
          <Button variant="text">x</Button>
        </Header>
        <Content>
          <div className="top-section">
            <span>개인정보</span>
            {DETECTION_ITEMS.map((item) => (
              <RuleRow key={item.key}>
                <label>
                  <input type="checkbox" />
                  {item.label}
                </label>
                <input type="text" placeholder="검출개수" />
                <input type="text" placeholder="예외 정규식" />
              </RuleRow>
            ))}
          </div>
          <div className="bottom-section">
            <div className="keyword-control">
              <span>
                키워드 <p>: 1 건</p>
              </span>
              <button>+</button>
            </div>
            <div className="keyword-box"></div>
          </div>
        </Content>
        <ButtonBox>
          <button>저장</button>
          <button>닫기</button>
        </ButtonBox>
      </ModalBox>
    </Modal>
  );
}

const ModalBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 680,
  height: 750,
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  //   justifyContent: 'space-between',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  borderBottom: '1px solid #e0e0e0',
  backgroundColor: colors.primary,
});

const HeaderText = styled('span')({
  color: colors.white,
  fontSize: '14px',
});

const Content = styled(Box)({
  padding: '10px 20px',

  '& > .top-section > span': {
    color: colors.primary,
  },

  '& > .bottom-section': {
    '&>.keyword-control': {
      display: 'flex',
      justifyContent: 'space-between',

      span: {},
      button: {},
    },
    '&>.keyword-box': {
      border: '1px solid rgba(0,0,0,0.15)',
      padding: '10px 5px',
      display: 'flex',
      gap: '10px',
    },
  },
});

const RuleRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',

  '& MuiFormControlLabel-root': {
    backgroundColor: 'pink',
    color: colors.textPrimary,
  },
});

const ButtonBox = styled(Box)({
  marginTop: 'auto',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '10px',
});

export default SettingModal;
