import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import { useTranslation } from 'react-i18next';

function LogInAction() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleClick = () => navigate('/login');

  return (
    <Button color="inherit" onClick={handleClick}>
      <LoginIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      {t('log_in')}
    </Button>
  );
}

export default LogInAction;
