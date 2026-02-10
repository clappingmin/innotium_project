import { useState } from 'react';
import './styles/App.scss';
import Button from '@mui/material/Button';
import SettingModal from './components/SettingModal';

function App() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <SettingModal open={open} onClose={handleClose} />
    </div>
  );
}

export default App;
