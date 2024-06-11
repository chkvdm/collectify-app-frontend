import React from 'react';
import { useState } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import config from '../../config';
import Loader from '../../components/Loader';
import CreateCollectionForm from './CreateCollectionForm';

const CreateCollection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    setLoading(true);
    const token = localStorage.getItem('collectify:token');
    Axios.postForm(
      `${config.apiBaseUrl}/api/v1/collections/${userId}/create-collection`,
      {
        ...values,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((response) => {
        if (response.status === 201) {
          navigate(-1);
          setLoading(false);
        }
      })
      .catch((err) => {
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
        <div className="collection-container">
          <div className="collection-form-container">
            <CreateCollectionForm {...{ error, handleSubmit }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCollection;
