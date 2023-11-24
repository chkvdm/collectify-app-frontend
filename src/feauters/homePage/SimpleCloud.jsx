import React, { useState, useEffect } from 'react';
import { TagCloud } from 'react-tagcloud';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

import config from '../../config';
import Loader from '../../components/Loader';

const SimpleCloud = (props) => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Axios.get(`${config.apiBaseUrl}/api/v1/collections/tags`)
      .then((response) => response.data)
      .then((data) => {
        const value = data.tags.reduce((accumulator, current) => {
          current.tags.forEach((tag) => {
            const existingTag = accumulator.find(
              (item) => item.value === tag.slice(1)
            );
            if (existingTag) {
              existingTag.count++;
            } else {
              accumulator.push({ value: tag.slice(1), count: 1 });
            }
          });
          return accumulator;
        }, []);
        setTags(value);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function handleClick(tag) {
    navigate(`/tag/search/${tag.value}`);
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <TagCloud
          minSize={12}
          maxSize={35}
          tags={tags}
          colorOptions={{
            luminosity: 'random',
            hue: 'random',
          }}
          style={{ cursor: 'pointer' }}
          onClick={(tag) => handleClick(tag)}
        />
      )}
    </div>
  );
};

export default SimpleCloud;
