import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

import LoginForm from './LoginForm';
import Loader from '../../../components/Loader';
// import '../../css/form.css';
import config from '../../../config.js';

const LoginPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (values) => {
    setLoading(true);
    Axios.post(`${config.apiBaseUrl}/api/v1/auth/login`, {
      email: values.email,
      password: values.password,
    })
      .then((response) => {
        if (response.status === 200) {
          const { token } = response.data;
          localStorage.setItem('collectify:token', token);
          props.setLoggedIn('LOGGED_IN');
          localStorage.setItem('collectify:logged_in', 'LOGGED_IN');
          navigate('/');
          navigate(0);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Something went wrong.');
        }
      });
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="auth-container">
          <div className="auth-form-container">
            <LoginForm {...{ error, handleSubmit }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
