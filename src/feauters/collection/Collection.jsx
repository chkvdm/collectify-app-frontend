import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import Loader from '../../components/Loader';
import ItemsTable from './ItemsTable';
import config from '../../config';

const Collection = () => {
  const [collection, setCollection] = useState({});
  const [loading, setLoading] = useState(false);
  const { collectionId } = useParams();

  useEffect(() => {
    setLoading(true);
    Axios.get(
      `${config.apiBaseUrl}/api/v1/collections/collection/${collectionId}`
    )
      .then((response) => response.data)
      .then((data) => {
        setCollection(data.collection);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [collectionId]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="main-container">
          <div className="container">
            <Box
              component="img"
              sx={{ maxWidth: { xs: 250, md: 550 }, borderRadius: 1 }}
              alt="collection pic"
              src={collection.image}
            />
            <Box sx={{ mt: 2 }}>
              <h1>{collection.collectionName}</h1>
            </Box>
            <Box sx={{ mt: 1 }}>
              <h3>{collection.theme}</h3>
            </Box>
            <Box>
              <h6>{collection.description}</h6>
            </Box>
            <Box>
              <ItemsTable
                collectionId={collectionId}
                userId={collection.userId}
              />
            </Box>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
