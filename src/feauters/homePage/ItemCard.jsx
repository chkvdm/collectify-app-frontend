import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ItemCard = (props, { key }) => {
  const navigate = useNavigate();

  function handleOpen() {
    navigate(`collection/${props.item.collectionId}/item/${props.item.id}`);
  }

  return (
    <div className="card">
      <Card sx={{ height: 200, width: 250 }}>
        <CardHeader
          title={props.item.itemName}
          onClick={handleOpen}
          style={{ cursor: 'pointer' }}
        />
        <CardContent>
          {props.item.tags.map((tag) => (
            <Typography
              key={props.item.tags.indexOf(tag)}
              variant="body2"
              color="text.secondary"
            >
              {tag}
            </Typography>
          ))}
        </CardContent>
        <CardActions>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <FavoriteBorderIcon sx={{ color: 'red', mr: 0.5 }} />
              {props.item.likes.length}
            </Box>
            <Box>
              {props.item.comments.length}
              <CommentIcon sx={{ ml: 0.5 }} />
            </Box>
          </Box>
        </CardActions>
      </Card>
    </div>
  );
};

export default ItemCard;
