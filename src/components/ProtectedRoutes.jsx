import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const options = {
  message: 'You need to log in for watch this page',
  buttons: [
    {
      label: 'Log In',
      onClick: () => (window.location = '/login'),
    },
    {
      label: 'Ok',
      onClick: () => {},
    },
  ],
  closeOnEscape: true,
  closeOnClickOutside: true,
  keyCodeForClose: [8, 32],
  willUnmount: () => {},
  afterClose: () => {},
  onClickOutside: () => {},
  onKeypress: () => {},
  onKeypressEscape: () => {},
  overlayClassName: 'overlay-custom-class-name',
};

function ProtectedRoutes(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.loggedIn !== 'LOGGED_IN') {
      confirmAlert(options);
      navigate('/');
    }
  }, [props.loggedIn, navigate]);
  return <Outlet />;
}

export default ProtectedRoutes;
