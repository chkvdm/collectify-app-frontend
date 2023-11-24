import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Checkbox, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import Axios from 'axios';
import { decodeToken } from 'react-jwt';
import { ToastContainer, toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { getItemData, allTypes } from './makeItemData';
import config from './../../config.js';
import CommentList from './CommentList';
import Loader from '../../components/Loader';
import CommentForm from './CommentForm';

const socket = io('https://collectify-api-wyxw.onrender.com/', {
  reconnection: true,
});

const Item = () => {
  const { t } = useTranslation();

  const token = localStorage.getItem('collectify:token') || false;
  let userInfo;
  if (token) userInfo = decodeToken(token);

  const userLogged = localStorage.getItem('collectify:logged_in');

  const [data, setData] = useState([]);
  const [types, setTypes] = useState({});
  const [itemName, setItemName] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsRealTime, setCommentsRealTime] = useState([]);
  const [itemAddLike, setItemAddLike] = useState([]);
  const [itemRemoveLike, setItemRemoveLike] = useState([]);
  const [loading, setLoading] = useState(false);

  const { collectionId, itemId } = useParams();

  useEffect(() => {
    setLoading(true);
    async function fetchTypes() {
      const types = await allTypes(collectionId);
      setTypes(types);
      setLoading(false);
    }
    fetchTypes();
  }, [collectionId]);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const data = await getItemData(itemId);
      setData([data.item]);
      setCollectionName(data.collectionName);
      setLoading(false);
    }
    fetchData();
  }, [itemId]);

  useEffect(() => {
    setItemName(data[0]?.itemName || '');
  }, [data]);

  useEffect(() => {
    socket.on('comment', (newComment) => {
      setCommentsRealTime(newComment.comments);
    });
  }, []);

  useEffect(() => {
    socket.on('add-like', (updateitem) => {
      const item = JSON.parse(JSON.stringify(updateitem));
      item.withNewLike.likes = [
        ...item.withNewLike.likes.map((item) => item.fromUser),
      ];
      setItemAddLike([item.withNewLike]);
      setItemRemoveLike('');
    });

    socket.on('remove-like', (updateitem) => {
      const item = JSON.parse(JSON.stringify(updateitem));
      item.withNewLike.likes = [
        ...item.withNewLike.likes.map((item) => item.fromUser),
      ];
      setItemRemoveLike([item.withNewLike]);
      setItemAddLike('');
    });
  }, []);

  const addLike = async () => {
    try {
      await Axios.post(
        `${config.apiBaseUrl}/api/v1/collections/add-like`,
        {
          itemId: itemId,
          fromUser: userInfo.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  const removeLike = async () => {
    try {
      await Axios.delete(
        `${config.apiBaseUrl}/api/v1/collections/remove-like`,
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: function (status) {
            return status < 500;
          },
          data: {
            itemId: itemId,
            fromUser: userInfo.id,
          },
        }
      );
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  let uiItem =
    itemAddLike.length > 0
      ? itemAddLike
      : itemRemoveLike.length > 0
      ? itemRemoveLike
      : data;

  const displayComments = useCallback(async () => {
    setLoading(true);
    try {
      Axios.get(
        `${config.apiBaseUrl}/api/v1/comments/all-comments/${itemId}`
      ).then((response) => {
        if (response.status === 200) {
          setComments(response.data.comments || []);
          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [itemId]);

  useEffect(() => {
    displayComments();
  }, [displayComments]);

  const columns = useMemo(() => {
    return Object.entries(types).map(([k]) => {
      if (k === 'id') {
        return {
          accessorKey: k,
          header: k,
          size: 220,
        };
      }
      if (k === 'itemName') {
        return {
          accessorKey: 'itemName',
          header: 'name',
        };
      }
      if (types[k] === 'checkbox') {
        return {
          accessorKey: k,
          header: k,
          size: 'auto',
          Cell: ({ cell }) => {
            const cellValue = cell.getValue();
            if (cellValue === 'yes') {
              return <Checkbox disabled checked={true} />;
            }
            return <Checkbox disabled checked={false} />;
          },
        };
      } else {
        return {
          accessorKey: k,
          header: k,
          size: 'auto',
        };
      }
    });
  }, [types]);

  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: false,
    renderBottomToolbarCustomActions: () => (
      <Box>
        {userLogged === 'LOGGED_IN' ? (
          uiItem[0]?.likes.includes(userInfo.id) ? (
            <IconButton onClick={removeLike} aria-label="add to favorites">
              <FavoriteIcon sx={{ color: 'red' }} />
            </IconButton>
          ) : (
            <IconButton onClick={addLike} aria-label="add to favorites">
              <FavoriteBorderIcon sx={{ color: 'red' }} />
            </IconButton>
          )
        ) : (
          <FavoriteBorderIcon sx={{ color: 'red' }} />
        )}
        {uiItem[0]?.likes?.length} Like(s)
      </Box>
    ),
  });

  const handleSubmit = (values) => {
    Axios.post(
      `${config.apiBaseUrl}/api/v1/comments/comment`,
      {
        itemId: itemId,
        fromUser: userInfo.id,
        text: values.comment,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((response) => {
        if (response.status === 201) {
          toast.success('comment added');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err);
      });
  };

  let uiCommentUpdate =
    commentsRealTime.length > 0 ? commentsRealTime : comments;

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="main-container">
          <div className="container">
            <ToastContainer />
            <Box sx={{ ml: 2, mt: 2 }}>
              <Box>
                <h1>{itemName}</h1>
              </Box>
              <Link
                to={`/collection/${collectionId}`}
                style={{ textDecoration: 'none' }}
              >
                <h4>{collectionName}</h4>
              </Link>
            </Box>

            <Box>
              <MaterialReactTable table={table} />
            </Box>
            <Box>
              {userInfo ? (
                <>
                  <Box sx={{ pt: 1, pl: 3, pb: 3, bgcolor: '#fafafa' }}>
                    <h2>{t('add_comment_here')}</h2>
                    <CommentForm {...{ handleSubmit }} />
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ pt: 1, pl: 3, pb: 1, bgcolor: '#fafafa' }}>
                    <Link to="/login">
                      <h4>{t('login_for_comment')}</h4>
                    </Link>
                  </Box>
                </>
              )}

              {uiCommentUpdate.map((comment) => (
                <Paper
                  key={comment.id}
                  style={{ maxHeight: '100%', overflow: 'auto' }}
                >
                  <CommentList {...comment} />
                </Paper>
              ))}
            </Box>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
