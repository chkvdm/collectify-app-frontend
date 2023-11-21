import React, { useEffect, useState } from 'react';
import Axios from 'axios';

import config from '../../config';
import Loader from '../../components/Loader';
import ItemCard from './ItemCard';
// import SimpleCloud from './SimpleCloud';

const Home = () => {
  const [lastItems, setLastItems] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="main-container">
          <div className="container">
            <div>
              <h2>Last Added Items</h2>
            </div>
            <div className="scrolling-wrapper-flexbox">
              {lastItems.map((item) => (
                <ItemCard key={item.id} {...{ item }} />
              ))}
            </div>
          </div>
          <div className="container">
            <div>
              <h2>Most Large Collections</h2>
            </div>
            <div className="scrolling-wrapper-flexbox">
              {/* <div className="card">
                <ItemCard />
              </div>
              <div className="card">
                <ItemCard />
              </div>
              <div className="card">
                <ItemCard />
              </div>
              <div className="card">
                <ItemCard />
              </div>
              <div className="card">
                <ItemCard />
              </div> */}
            </div>
          </div>
          {/* <div className="container">
            <div className="teg-cloud">
              <SimpleCloud />
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Home;
