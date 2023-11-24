import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const DarkMode = () => {
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem('collectify:theme')
  );

  const setDarkMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'dark');
    localStorage.setItem('collectify:theme', 'dark');
    setSelectedTheme('dark');
  };

  const setLightMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'light');
    localStorage.setItem('collectify:theme', 'light');
    setSelectedTheme('light');
  };

  useEffect(() => {
    if (selectedTheme === 'dark') {
      setDarkMode();
    } else {
      setLightMode();
    }
  }, [selectedTheme]);

  return (
    <div>
      <div>
        <IconButton sx={{ ml: 1 }} color="inherit">
          {selectedTheme === 'light' ? (
            <Brightness7Icon onClick={setDarkMode} />
          ) : (
            <Brightness4Icon onClick={setLightMode} />
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default DarkMode;
