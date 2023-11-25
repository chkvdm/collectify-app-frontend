import { React, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ThemeProvider } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { decodeToken } from 'react-jwt';

import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  theme,
} from '../../css/NavBar';
import LogInAction from './LogInAction';
import DarkMode from './DarkMode';
import Loader from '../../components/Loader';

const NavBar = (props) => {
  const { t } = useTranslation();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('collectify:token') || false;
  let userInfo;
  if (token) userInfo = decodeToken(token);

  const settings = [
    { name: t('profile'), action: handleProfile },
    { name: t('log_out'), action: handleLogOut },
  ];

  const adminSettings = [
    { name: t('profile'), action: handleProfile },
    { name: t('admin_panel'), action: handleAdminPanel },
    { name: t('log_out'), action: handleLogOut },
  ];

  const navigate = useNavigate();

  function handleProfile() {
    navigate(`/user/account/${userInfo.id}`);
  }

  function handleAdminPanel() {
    navigate('/admin-panel/users');
  }

  const handleLangChange = (e) => {
    props.setLang(e.target.value);
    localStorage.setItem('collectify:lang', e.target.value);
  };

  function handleLogOut() {
    setLoading(true);
    localStorage.removeItem('collectify:token');
    localStorage.setItem('collectify:logged_in', 'NOT_LOGGED_IN');
    navigate('/');
    navigate(0);
    setLoading(false);
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search/${searchValue}`);
      setSearchValue('');
    }
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
          <Box sx={{ textAlign: 'left' }}>
            <AppBar position="static" color="light">
              <Toolbar variant="dense">
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <VerifiedIcon
                    sx={{ mr: 1 }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                  />
                </Typography>
                <DarkMode />

                <FormControl sx={{ m: 1, minWidth: 50 }} size="small">
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    sx={{
                      '.MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'none',
                      },
                    }}
                    value={props.lang ? props.lang : 'en'}
                    onChange={handleLangChange}
                  >
                    <MenuItem value={'en'}>{t('en')}</MenuItem>
                    <MenuItem value={'ru'}>{t('ru')}</MenuItem>
                  </Select>
                </FormControl>

                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder={t('search')}
                    sx={{ width: 150 }}
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchValue}
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                  />
                </Search>

                {props.loggedIn === 'LOGGED_IN' ? (
                  <Box sx={{ flexGrow: 0 }}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <AccountCircleIcon transform={'scale(1.6)'} />
                    </IconButton>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {(userInfo?.role === 'admin'
                        ? adminSettings
                        : settings
                      ).map((setting) => (
                        <MenuItem
                          key={setting.name}
                          onClick={() => {
                            handleCloseUserMenu();
                            setting.action();
                          }}
                        >
                          <Typography textAlign="center">
                            {setting.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                ) : (
                  <LogInAction />
                )}
              </Toolbar>
            </AppBar>
          </Box>
        </ThemeProvider>
      )}
    </div>
  );
};

export default NavBar;
