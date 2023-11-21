import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useCallback } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import userStatusCheck from './userStatusCheck';

function UserStatus() {
  const navigate = useNavigate();

  const handleLogOut = useCallback(() => {
    localStorage.removeItem('collectify:token');
    localStorage.setItem('collectify:logged_in', 'NOT_LOGGED_IN');
    navigate('/');
    navigate(0);
  }, [navigate]);

  const options = useMemo(
    () => ({
      message:
        'Your account was blocked. If you think this happened by mistake, please contact your administrator.',
      buttons: [
        {
          label: 'Ok',
          onClick: () => handleLogOut(),
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      keyCodeForClose: [8, 32],
      willUnmount: () => handleLogOut(),
      afterClose: () => handleLogOut(),
      onClickOutside: () => handleLogOut(),
      onKeypress: () => handleLogOut(),
      onKeypressEscape: () => handleLogOut(),
      overlayClassName: 'overlay-custom-class-name',
    }),
    [handleLogOut]
  );

  useEffect(() => {
    const token = localStorage.getItem('collectify:token');

    if (token) {
      userStatusCheck(token)
        .then((isActive) => {
          if (!isActive) {
            confirmAlert(options);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [navigate, options]);

  return <Outlet />;
}

export default UserStatus;
