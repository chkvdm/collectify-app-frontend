import React from 'react';
import NavBar from '../feauters/navBar/NavBar';
import { Outlet } from 'react-router';

const WithNav = ({ loggedIn, lang, setLang }) => {
  return (
    <>
      <NavBar {...{ loggedIn, lang, setLang }} />
      <Outlet />
    </>
  );
};

export default WithNav;
