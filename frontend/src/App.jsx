import './styles/App.scss';
import { analyzeDocument } from './api/analyzeApi';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ResultCard from './components/ResultCard';
import { useState } from 'react';
import SettingModal from './components/SettingModal';
import { styled } from '@mui/material';

function App() {
  const [openSettings, setOpenSettings] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleSettingsOpen = () => setOpenSettings(true);
  const handleSettingsClose = () => setOpenSettings(false);

  const handleAnalyze = async (file) => {
    try {
      setIsAnalyzing(true);
      setResult(null);

      // localStorage에서 설정 가져오기
      const settings = JSON.parse(localStorage.getItem('pii-settings') || '{}');

      // 기본 설정
      const defaultSettings = {
        주민등록번호: { enabled: true },
        외국인등록번호: { enabled: true },
        여권번호: { enabled: true },
        운전면허번호: { enabled: true },
        전화번호: { enabled: true },
        계좌번호: { enabled: true },
        신용카드번호: { enabled: true },
        이메일: { enabled: true },
        사업자등록번호: { enabled: true },
        ...settings,
      };

      const analyzeResult = await analyzeDocument(file, defaultSettings);

      console.log('분석 결과:', analyzeResult);
      setResult(analyzeResult);
    } catch (error) {
      console.error('분석 실패:', error);
      alert('문서 분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      <Header onSettingsClick={handleSettingsOpen} />
      <Container>
        <FileUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        <ResultCard result={result} />
      </Container>
      <SettingModal open={openSettings} onClose={handleSettingsClose} />
    </div>
  );
}

const Container = styled('div')({
  margin: '30px auto',
  padding: '0 60px',
});

export default App;
