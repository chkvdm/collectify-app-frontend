import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/material';

import config from '../../config';
import Loader from '../../components/Loader';

const TagSearch = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Axios.get(`${config.apiBaseUrl}/api/v1/search/tag/${query}`)
      .then((response) => response.data)
      .then((data) => {
        const items = data.results.hits.hits.map(
          ({ _source: { id, collection, name, tags } }) => ({
            id,
            collection,
            name,
            tags,
          })
        );
        setResults(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [query]);

  const handleClick = (collection, id) => {
    navigate(`/collection/${collection}/item/${id}`);
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
              {results?.map((result) => (
                <Box key={result.id}>
                  <ListItem
                    alignItems="flex-start"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleClick(result.collection, result.id)}
                  >
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: '20px',
                        color: 'primary',
                      }}
                      primary={result.name}
                      secondary={
                        <React.Fragment>
                          {result?.tags?.join(' ')}
                        </React.Fragment>
                      }
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

export default TagSearch;
