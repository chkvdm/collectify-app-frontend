import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useTranslation } from 'react-i18next';

import config from '../../config';
import Loader from '../../components/Loader';
import ItemCard from './ItemCard';
import CollectionCard from './CollectionCard';
import SimpleCloud from './SimpleCloud';

const Home = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [lastItems, setLastItems] = useState([]);
  const [largestCollections, setLargestCollections] = useState([]);

  const showLAstItems = async () => {
    setLoading(true);
    Axios.get(`${config.apiBaseUrl}/api/v1/collections/last-items`)
      .then((response) => response.data)
      .then((data) => {
        setLastItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    showLAstItems();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const firstResponse = await Axios.get(
          `${config.apiBaseUrl}/api/v1/collections/largest`
        );
        const responses = await Promise.all(
          firstResponse.data.largestCollections.map((el) =>
            Axios.get(
              `${config.apiBaseUrl}/api/v1/collections/collection/${el.collection_id}`
            ).then((response) => response.data)
          )
        );
        setLargestCollections(responses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="main-container">
          <div className="container">
            <div>
              <h2>{t('most_large_collections')}</h2>
            </div>
            <div className="scrolling-wrapper-flexbox">
              {largestCollections.map((collection) => (
                <CollectionCard key={collection.id} {...collection} />
              ))}
            </div>
          </div>
          <div className="container">
            <div>
              <h2>{t('last_added_items')}</h2>
            </div>
            <div className="scrolling-wrapper-flexbox">
              {lastItems.map((item) => (
                <ItemCard key={item.id} {...{ item }} />
              ))}
            </div>
          </div>
          <div className="container">
            <div className="teg-cloud">
              <SimpleCloud />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
