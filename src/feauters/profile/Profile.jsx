import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import { decodeToken } from 'react-jwt';

import CollectionCard from './CollectionCard';
import Loader from '../../components/Loader';
import config from '../../config';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams();

  const token = localStorage.getItem('collectify:token');
  let currentUserInfo;
  if (token) currentUserInfo = decodeToken(token);

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  const onCreateCollection = () => {
    navigate(`/user/account/${userId}/create-collection`);
  };

  const handleLearnMore = (id) => {
    navigate(`/collection/${id}`);
  };

  const deleteCollection = async (id) => {
    try {
      const token = localStorage.getItem('collectify:token');
      await Axios.delete(`${config.apiBaseUrl}/api/v1/collections`, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: function (status) {
          return status < 500;
        },
        data: {
          id,
          userId,
        },
      }).then((response) => {
        setCollections(response.data.collections);
      });
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  const handleDelete = (id) => {
    const options = {
      message: 'Delete collection?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteCollection(id),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
      closeOnEscape: false,
      closeOnClickOutside: true,
      keyCodeForClose: [8, 32],
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypress: () => {},
      onKeypressEscape: () => {},
      onKeypressEnter: () => {},
      overlayClassName: 'overlay-custom-class-name',
    };
    confirmAlert(options);
  };

  useEffect(() => {
    const showCollections = async () => {
      setLoading(true);
      const token = localStorage.getItem('collectify:token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await Axios.get(
          `${config.apiBaseUrl}/api/v1/collections/all-collections/${userId}`,
          {
            headers,
          }
        );
        const data = response.data;
        setCollections(data.collections);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    showCollections();
  }, [userId]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <ToastContainer />
          <div className="main-container">
            {(userId === currentUserInfo?.id ||
              currentUserInfo?.role === 'admin') && (
              <>
                <div className="container control-panel mt-5">
                  <div className="status-btn">
                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" onClick={onCreateCollection}>
                        {t('create_collection')}
                      </Button>
                    </Stack>
                  </div>
                </div>
              </>
            )}
            <div className="container">
              <div className="row">
                {collections.map((col, i) => (
                  <CollectionCard
                    key={i}
                    {...{
                      col,
                      i,
                      handleDelete,
                      handleLearnMore,
                      userId,
                      currentUserInfo,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
