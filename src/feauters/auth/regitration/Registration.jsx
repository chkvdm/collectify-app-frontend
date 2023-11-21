import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

import RegistrationForm from './RegistrationForm';
import Loader from '../../../components/Loader';
import '../../../css/form.css';
import config from '../../../config';

const RegistrationPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (values) => {
    setLoading(true);
    Axios.post(`${config.apiBaseUrl}/api/v1/auth/register`, {
      email: values.email,
      password: values.password,
      name: values.name,
    })
      .then((response) => {
        if (response.status === 201) {
          navigate('/login');
          setLoading(true);
        }
      })
      .catch((err) => {
        setLoading(true);
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
            <RegistrationForm {...{ error, handleSubmit }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
