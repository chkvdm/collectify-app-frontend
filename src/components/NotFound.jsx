import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function NotFound() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h1" style={{ color: 'white' }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: 'white', fontSize: '2em' }}>
        {t('oops')}
      </Typography>
      <Typography variant="h6" style={{ color: 'white' }}>
        {t('not_found')}
      </Typography>
      <Button variant="outlined" href="/" sx={{ mt: 3 }}>
        Back Home
      </Button>
    </Box>
  );
}

export default NotFound;
