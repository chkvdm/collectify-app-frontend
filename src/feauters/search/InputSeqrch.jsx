import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/material';

import config from '../../config';
import Loader from '../../components/Loader';

const InputSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  const { query } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Axios.get(`${config.apiBaseUrl}/api/v1/search/${query}`)
      .then((response) => response.data)
      .then((data) => {
        const { resultsHits } = data;

        const results = {
          collections: [],
          items: [],
        };

        resultsHits.forEach((hit) => {
          const { _index, _source } = hit;

          if (_index === 'search-collections') {
            const { id, name, theme } = _source;
            results.collections.push({ id, name, theme });
          } else if (_index === 'search-items') {
            const { id, collection, name, tags } = _source;
            results.items.push({ id, collection, name, tags });
          }
        });

        setResults(results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [query]);

  const handleOpenItem = (collection, id) => {
    navigate(`/collection/${collection}/item/${id}`);
  };

  const handleOpenCollection = (id) => {
    navigate(`/collection/${id}`);
  };

  return (
    <div className="main-container">
      <div className="container">
        <Box sx={{ background: '#fff', width: '100%', borderRadius: 1 }}>
          {loading ? (
            <Loader />
          ) : (
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                ml: 5,
              }}
            >
              {results?.items?.map((result) => (
                <Box key={result.id}>
                  <ListItem
                    alignItems="flex-start"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenItem(result.collection, result.id)}
                  >
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: '20px',
                        color: 'primary',
                      }}
                      primary={result.name}
                      secondary={<Fragment>{result.tags.join(' ')}</Fragment>}
                    />
                  </ListItem>
                  <Divider component="li" />
                </Box>
              ))}
              {results?.collections?.map((result) => (
                <Box key={result.id}>
                  <ListItem
                    alignItems="flex-start"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenCollection(result.id)}
                  >
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: '20px',
                        color: 'primary',
                      }}
                      primary={result.name}
                      secondary={result.theme}
                    />
                  </ListItem>
                  <Divider component="li" />
                </Box>
              ))}
            </List>
          )}
        </Box>
      </div>
    </div>
  );
};

export default InputSearch;
