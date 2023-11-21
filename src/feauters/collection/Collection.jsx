import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

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
        <>
          <img
            src={collection.image}
            alt="collection pic"
            width="100"
            height="100"
          />
          <div>
            <h3>{collection.collectionName}</h3>
          </div>
          <div>
            <h3>{collection.theme}</h3>
          </div>
          <div>
            <h6>{collection.description}</h6>
          </div>
          <div>
            <ItemsTable
              collectionId={collectionId}
              userId={collection.userId}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Collection;
