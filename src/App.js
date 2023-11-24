import { React, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Home from './feauters/homePage/Home';
import Registration from './feauters/auth/regitration/Registration';
import Login from './feauters/auth/login/Login';
import CreateCollection from './feauters/createCollection/CreateCollection';
import WithNav from './components/WithNav';
import WithoutNav from './components/WithoutNav';
import Profile from './feauters/profile/Profile';
import Collection from './feauters/collection/Collection';
import Item from './feauters/item/Item';
import AdminPanel from './feauters/adminPanel/AdminPanel';
import ProtectedRoutes from './components/ProtectedRoutes';
import UserStatus from './components/UserStatus';
import TagSearch from './feauters/search/TagSearch';
import './App.css';

function App() {
  const [lang, setLang] = useState(
    localStorage.getItem('collectify:lang') || 'en'
  );
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem('collectify:logged_in')
  );

  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<WithoutNav />}>
            <Route path="/registration" element={<Registration />}></Route>
            <Route
              path="/login"
              element={<Login {...{ setLoggedIn }} />}
            ></Route>
          </Route>
          <Route element={<UserStatus />}>
            <Route element={<WithNav {...{ loggedIn, lang, setLang }} />}>
              <Route path="/" element={<Home />}></Route>
              <Route path="/tag/search/:query" element={<TagSearch />} />
              <Route
                path="/collection/:collectionId"
                element={<Collection />}
              />
              <Route
                path="/collection/:collectionId/item/:itemId"
                element={<Item />}
              />
              <Route path="/user/account/:userId" element={<Profile />} />

              <Route element={<ProtectedRoutes {...{ loggedIn }} />}>
                <Route
                  path="/user/account/:userId/create-collection"
                  element={<CreateCollection />}
                ></Route>
                <Route path="/admin-panel/users" element={<AdminPanel />} />
                <Route
                  path="/admin-panel/users/user/account/:userId"
                  element={<Profile />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
